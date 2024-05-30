import {Handle, Position} from 'reactflow';
import { MessageSquareMore } from 'lucide-react';

export const CustomTextNode = ({data, ...props}) =>{
  return (
    <div className="flex-col shadow-custom dark:shadow-customDark border min-w-72 bg-background dark:border-white dark:bg-black rounded-lg">
      <Handle
          type="target"
          position={Position.Left}
        />
      <div className="flex justify-between p-2 border-b bg-green-200 dark:bg-green-950 dark:border-white">
        <MessageSquareMore size={16} />

        <p className="text-xs font-bold">Send Message</p>

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1022px-WhatsApp.svg.png"
          height={'20px'}
          width={'20px'}
          alt=""
        />
      </div>

      <div className="p-2 py-4">
      
          <h1 className="text-sm text-center whitespace-pre-line" onClick={() => data.onClick()}>
            {data.value}
          </h1>
        
      </div>
      <Handle
          type="source"
          position={Position.Right}
          // isConnectable={isConnectable}
        />
    </div>
  );
}
