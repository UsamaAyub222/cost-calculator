import "./App.css";
import { Layout } from "antd";
import Headers from "./components/Headers";
import Siders from "./components/Siders";
import CostCalculations from "./components/CostCalculations";
import Footers from "./components/Footers";
const { Content } = Layout;

function App() {
  // useEffect(() => {
  //   console.log(ductwork);
  // }, [ductwork]);
  return (
    <Layout>
      <Headers />
      <Content>
        <Layout id="layout">
          <Siders />
          <Content id="mainContentContainer">
            <CostCalculations />
          </Content>
        </Layout>
      </Content>
      <Footers />
    </Layout>
  );
}

export default App;
