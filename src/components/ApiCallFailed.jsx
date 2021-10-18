import { Result, Button } from "antd";

const ApiCallFailed = () => {
  return (
    <Result
      status="500"
      title="500"
      subTitle={
        <div>
          <h3>Sorry, we are failed to fetch data from backend services. Press below [REFRESH] button to retry. </h3>
          <h4>If same error still exists, please contact system adminmistrator.</h4>
        </div>
      }
      extra={<Button type="primary">REFRESH</Button>}
    />
  );
};

export default ApiCallFailed;
