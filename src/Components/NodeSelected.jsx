import { MessageSquareMore } from "lucide-react";

const nodeTypes = [
  {
    type: 'text',
    value: 'Message',
    icon: MessageSquareMore,
    disabled: true,
  },]

export const NodeSelected = () => {
  const onDragStart = (event, node) => {
    event.dataTransfer.setData('application/reactflow', node.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div>
      <h1 className="text-lg mb-3">Select a Node</h1>

      <div className="flex w-full justify-between">
        {nodeTypes.map(Node => (
          <div
            key={Node.type}
            onDragStart={event => onDragStart(event, Node)}
            draggable
            className="flex flex-col w-full items-center justify-between p-4 my-2 bg-background border-2 border-blue-500 rounded-lg  md:w-[48%]  cursor-pointer">
            <div className="rounded-full mb-5 ">
              <Node.icon size={24} className="text-blue-500" />
            </div>

            <span className="text-base select-none text-blue-500">{Node.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
