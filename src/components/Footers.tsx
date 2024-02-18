import { Layout, Space } from "antd";
import {
  FacebookFilled,
  HomeFilled,
  InstagramFilled,
  LinkedinFilled,
  TwitterSquareFilled,
  YoutubeFilled,
} from "@ant-design/icons";
const { Footer } = Layout;

export default function Footers() {
  return (
    <>
      <Footer style={{ display: "flex" }}>
        <div style={{ justifyContent: "left", color: "#00000091" }}>
          <a href="" className="footer-menue">
            About Us
          </a>{" "}
          |{" "}
          <a href="" className="footer-menue">
            News
          </a>{" "}
          |{" "}
          <a href="" className="footer-menue">
            Privacy
          </a>{" "}
          |{" "}
          <a href="" className="footer-menue">
            Terms of Use
          </a>{" "}
          |{" "}
          <a href="" className="footer-menue">
            Doing Business with Us
          </a>
        </div>
        <div style={{ justifyContent: "right", display: "flex", flex: "auto" }}>
          <Space className="footer-icons">
            <FacebookFilled
              style={{ fontSize: "20px", color: "rgba(0, 0, 0, 0.57)" }}
            />
            <TwitterSquareFilled
              style={{ fontSize: "20px", color: "rgba(0, 0, 0, 0.57)" }}
            />
            <YoutubeFilled
              style={{ fontSize: "20px", color: "rgba(0, 0, 0, 0.57)" }}
            />
            <LinkedinFilled
              style={{ fontSize: "20px", color: "rgba(0, 0, 0, 0.57)" }}
            />
            <InstagramFilled
              style={{ fontSize: "20px", color: "rgba(0, 0, 0, 0.57)" }}
            />
            <HomeFilled
              style={{ fontSize: "20px", color: "rgba(0, 0, 0, 0.57)" }}
            />
          </Space>
        </div>
      </Footer>
      <Footer style={{ background: "#170e67", color: "#fff" }}>
        ©Commonwealth Edison Company 2023, All Rights Reserved.
      </Footer>
    </>
  );
}
