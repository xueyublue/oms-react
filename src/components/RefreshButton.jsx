import { Button, Tooltip } from "antd";
import { FcSynchronize } from "react-icons/fc";

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
const RefreshButton = ({ onClick }) => {
  return (
    <Tooltip placement="bottom" title="Refresh">
      <Button type="text" icon={<FcSynchronize size={22} />} onClick={onClick} />
    </Tooltip>
  );
};

export default RefreshButton;
