import React from 'react';
import { NodeSelected } from './NodeSelected';
import { NodeEditor } from './NodeEditor';

export const NodePanelSidebar = ({selectedNode, updateSelectedNode, cancelSelection}) => {
  return (
    <div>
      {selectedNode && selectedNode.type === 'text' ? (
        <NodeEditor
          cancelSelection={cancelSelection}
          selectedNode={selectedNode}
          updateSelectedNode={updateSelectedNode}
        />
      ) : (
        <div className="p-4">
          <NodeSelected />
        </div>
      )}
    </div>
  );
}
