import { useState } from "react";
import { Layout, Menu, MenuProps } from "antd";
import logoImage from "../logo-comed-1.svg";

const { Header } = Layout;
export default function Headers() {
  const [mobileShowMenu, setMobileShowMenu] = useState<Boolean>(false);
  
  const items1: MenuProps["items"] = [
    "Customers",
    "Contractors",
    "About ComEd",
    "Contact",
  ].map((key) => ({
    key,
    label: `${key}`,
  }));

  const handleMobileMenu = () => {
    setMobileShowMenu(!mobileShowMenu)
  }
  return (
    <Header
      id="header"
    >
      <div className="logoContainer">
        <a href="https://comed.fcg-staging.dev/">
        <img
        className="logoImage"
        src={logoImage}
        alt="ComED - An Exelon Company"
      />
        </a>
      </div>
      {/* <Menu
        id="primary-menu"
        className="header-menu-item mainMenu"
        mode="horizontal"
        items={items1}
        style={{
          minWidth: 0,
          flex: "auto",
          background: "#170e67",
          color: "white",
          justifyContent: "center",
        }}
      /> */}
      <button className="menu-toggle" onClick={handleMobileMenu}>Primary Menu</button>
      <nav id="site-navigation" className="main-navigation">
        <div className="menu-primary-container">
          <ul id="primary-menu" className={"menu nav-menu "+(mobileShowMenu === true ? 'menu-show-mobile' : 'menu-hide-mobile')}>
            <li id="menu-item-156" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-ancestor current-menu-parent current_page_parent current_page_ancestor menu-item-has-children menu-item-156">
              <a href="https://goelectricgo.wpengine.com/">For Customers</a>
              <ul className="sub-menu">
                <li id="menu-item-129" className="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item page-item-74 current_page_item menu-item-129"><a href="https://goelectricgo.wpengine.com/what-are-heat-pumps/" aria-current="page">What are Heat Pumps?</a></li>
                <li id="menu-item-128" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-128"><a href="https://goelectricgo.wpengine.com/options-for-your-home/">Options for Your Home</a></li>
              </ul>
            </li>
            <li id="menu-item-36" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-36"><a target="_blank" rel="noopener" href="https://slipstreaminc.org/ComEd-ASHP">For Contractors</a></li>
            <li id="menu-item-38" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-38"><a target="_blank" rel="noopener" href="https://www.comed.com/MyAccount/CustomerSupport/Pages/ContactUs.aspx">Contact Us</a></li>
            <li id="menu-item-37" className="visit-comed menu-item menu-item-type-custom menu-item-object-custom menu-item-37"><a target="_blank" rel="noopener" href="https://www.comed.com/Pages/default.aspx">Visit ComEd.com</a></li>
          </ul>
        </div>
      </nav>
      
    </Header>
  );
}
