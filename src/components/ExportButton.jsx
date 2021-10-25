import { Button, Tooltip } from "antd";
import { CSVLink } from "react-csv";
import { FcDownload } from "react-icons/fc";

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
const ExportButton = ({ csvReport }) => {
  return (
    <Tooltip placement="bottom" title="EXPORT">
      <CSVLink {...csvReport}>
        <Button type="text" icon={<FcDownload size={22} />} />
      </CSVLink>
    </Tooltip>
  );
};

export default ExportButton;
