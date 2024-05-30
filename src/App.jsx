import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactFlow, {
  Background,
  Controls,
  Position,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Header from './Components/Header';
import { NodePanelSidebar } from './Components/NodePanelSidebar';
import { CustomTextNode } from './Components/CustomTextNode';
import { Toaster, toast } from 'sonner';

const nodeTypes = {
  text: CustomTextNode,
};

let id = JSON.parse(localStorage.getItem('flow'))?.edges?.length+2 || 1;

const getId = () => {
  return `${id++}`;
};

export default function App() {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    params =>
      setEdges(eds => {
        if (eds && eds.some(e => e.source === params.source)) {

          toast.error('Source node is already connected to another node');

          return eds;
        } else if (eds && eds.some(e => e.target === params.target)) {
          return addEdge({...params}, eds);
        } else {
          return addEdge({...params, type: 'custom-edge'}, eds);
        }
      }),
    [],
  );


  const onDragOver = useCallback(event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    event => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nid = getId();
      const newNode = {
        id: nid,
        type,
        position,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {value: `${type} ${nid}`, onClick: () => onNodeClick(null, {id: nid})},
      };
      setNodes(nds => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const onNodeClick = (_, node) => setSelectedNode(node);

  const updateSelectedNode = value => {
    if (!selectedNode) {
      return;
    }

    setNodes(nodes =>
      nodes.map(node => {
        if (node.id === selectedNode.id) {
          node.data.value = value;
        }

        return node;
      }),
    );
  };

  const validateFlow = () => {
    const sourceNodes = new Set();
    const targetNodes = new Set();

    edges.forEach(edge => {
      sourceNodes.add(edge.source);
      targetNodes.add(edge.target);
    });

    const nodesWithoutSourceAndTarget = nodes.filter(
      node => !sourceNodes.has(node.id) && !targetNodes.has(node.id),
    );

    console.log(nodesWithoutSourceAndTarget);

    if (nodesWithoutSourceAndTarget.length > 0) {
      toast.error('More than one nodes without source and target connections');
    } else {
      toast.success("Your Messages are Stored")
      saveFlowToLocal();
    }
  };

  const saveFlowToLocal = () => {
    console.log("here")
    localStorage.setItem('flow', JSON.stringify({nodes, edges}));
    setShowSaveAnimation(true);
  };

  useEffect(() => {
    const flow = localStorage.getItem('flow');
    if (flow) {
      const {nodes, edges} = JSON.parse(flow);
      setNodes(nodes);
      setEdges(edges);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header onClickSave={validateFlow} />

      <div className="flex flex-row flex-grow h-full">
        <ReactFlowProvider>
          <div className="reactflow-wrapper w-3/4 h-full" ref={reactFlowWrapper}>
            <ReactFlow
              fitView
              nodes={nodes}
              edges={edges}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={() => setSelectedNode(null)}
              onEdgeClick={() => setSelectedNode(null)}>
              <Background />
              <Controls />
            </ReactFlow>
          </div>
          <div className="flex-grow border-s">
            <NodePanelSidebar
              selectedNode={selectedNode}
              cancelSelection={() => setSelectedNode(null)}
              updateSelectedNode={value => updateSelectedNode(value)}
            />
          </div>
        </ReactFlowProvider>
      </div>
      <Toaster position='top-center' richColors />
    </div>
  );
}
