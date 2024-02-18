import { Layout, Collapse, List } from "antd";
const { Sider } = Layout;
const { Panel } = Collapse;

// const siderStyle: React.CSSProperties = {
//   flex: '0 0 200px',
//   max-width: '200px',
//   min-width: '200px',
//   width: '200px',
//   backgroundColor: '#EEEEEE'
// };

export default function Siders() {
  return (
    <Sider id="sideBar">
      <Collapse className="sidebarMenu menu-hide-mobile" accordion defaultActiveKey={["1"]} expandIconPosition="end" bordered={false} style={{ borderRadius: 0 }}>
        <Panel className="sidebarHeader" header="Customers" key="1" style={{ borderRadius: 0 }}>
          <List itemLayout="horizontal" style={{ borderRadius: 0 }}>
            <List.Item className="sidebarMenuItem sider-list"><a className="siderbar-item" href="https://goelectricgo.wpengine.com/what-are-heat-pumps/">What are Heat Pumps</a></List.Item>
            <List.Item className="sidebarMenuItem sider-list"><a className="siderbar-item" href="https://goelectricgo.wpengine.com/options-for-your-home/">Options for Your Home</a></List.Item>
            <List.Item className="sidebarMenuItem active sider-list">
              <a className="siderbar-item active" href="">Savings Calculator</a>
            </List.Item>
          </List>
        </Panel>
      </Collapse>
    </Sider>
  );
}
