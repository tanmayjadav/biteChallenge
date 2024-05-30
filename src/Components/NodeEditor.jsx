import { ArrowLeft} from "lucide-react";

export const NodeEditor = ({selectedNode, updateSelectedNode, cancelSelection}) => {
  return (
    <div className="">
      <div className="mb-5 flex justify-between border-b p-4 py-2">
        <ArrowLeft size={28} className="cursor-pointer" onClick={cancelSelection} />

        <h1 className="text-base font-medium">Message</h1>

        <div />
      </div>

      <div className="px-4">
        <h1 className="text-sm mb-3 text-gray-500">Edit Text</h1>

        <textarea
          className="w-full p-2 mb-3 bg-white border-2 border-blue-500 rounded-lg font-medium"
          placeholder="Type your message here..."
          value={selectedNode.data.value}
          onChange={event => updateSelectedNode(event.target.value)}
        />
      </div>
    </div>
  );
}
