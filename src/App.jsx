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

let id = JSON.parse(localStorage.getItem('flow')).edges.length+2 || 1;

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
          // if the target node is already connected to another node
          // then do nothing
          return addEdge({...params}, eds);
        } else {
          // if the source and target nodes are not connected to any other nodes
          // then add the custom edge
          // basically the custom edge, renders an arrow icon at the target node
          return addEdge({...params, type: 'custom-edge'}, eds);
        }

        // addEdge(params, eds)
      }),
    [],
  );

  /**
   * dragover event handler to prevent default behavior
   * and set the drop effect to move
   */
  const onDragOver = useCallback(event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * drop event handler to add a new node to the flow
   * whenever a node is dropped on the flow
   * it will create a new node with the type of the dropped element
   * and add it to the nodes array
   * and set the position of the new node to the mouse position
   */
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

  /**
   * on click handler for the nodes
   * to select the node and show the editor
   */
  const onNodeClick = (_, node) => setSelectedNode(node);

  /**
   * the core function to update the selected node value
   * whenever a node is selected and edited
   */
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

  /**
   * if there are more than one nodes,
   * and any one of the node does not have a connection from source to target
   * then the flow is invalid
   */
  const validateFlow = () => {
    const sourceNodes = new Set();
    const targetNodes = new Set();

    // collect all source and target nodes
    edges.forEach(edge => {
      sourceNodes.add(edge.source);
      targetNodes.add(edge.target);
    });

    // check for nodes without source and target handles
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
