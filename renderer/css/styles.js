import photon from "./photon.min.css";
import css from "styled-jsx/css";

export default css`
  ${photon} @font-face {
    font-family: "photon-entypo";
    src: url("/static/fonts/photon-entypo.eot");
    src: url("/static/fonts/photon-entypo.eot?#iefix") format("eot"),
      url("/static/fonts/photon-entypo.woff") format("woff"),
      url("/static/fonts/photon-entypo.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: "ubuntu-bold-italic";
    src: url("/static/fonts/ubuntu-bold-italic.ttf");
    src: url("/static/fonts/ubuntu-bold-italic.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
  }

  * {
    cursor: inherit;
  }

  .hide {
    display: none;
  }

  .slide-right {
    right: -300px;
    animation: slideAnimation 0.3s forwards;
    animation-delay: 0s;
  }

  @keyframes slideAnimation {
    100% {
      right: 0;
    }
  }
  .slide-left {
    left: -300px;
    animation: slideAnimationLeft 0.3s forwards;
    animation-delay: 0s;
  }

  @keyframes slideAnimationLeft {
    100% {
      left: 0;
    }
  }

  .btn .dropdown {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    transition: all 0.3s ease;
    margin-top: 20px;
    right: 18px;
    background-color: rgb(245, 245, 245);
    z-index: 1;
    list-style: none;
    padding: 0px;
    width: 100px;
    box-shadow: 0px 5px 18px -6px #000;
    border: 1px solid rgb(210, 210, 210);
    border-radius: 4px;
  }
  .nav-group-item {
    padding: 10px 10px 10px 10px;
    cursor: pointer;
  }
  .nav-group-item:hover {
    background-color: #c7c7c7;
  }

  .btn .dropdown.active {
    visibility: visible;
    opacity: 1;
  }

  .btn .dropdown li {
    clear: both;
    width: 100%;
  }

  .toolbar-header {
    padding: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    background-color: #fefefe;
    background-image: none;
    border-bottom: 2px solid #c2c0c2;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: center;
    align-items: center;
  }
  .toolbar-header .icon-item {
    order: 0;
    flex: 0 1 auto;
    align-self: auto;
    width: 28px;
    height: 28px;
  }
  .title.cursor,
  .icon-item.cursor {
    cursor: pointer;
  }
  .closeIcon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: inline-block;
  }

  .toolbar-header h1.title {
    order: 0;
    flex: 1 1 auto;
    align-self: auto;
    font-weight: bold;
    font-size: 16px;
    font-family: "ubuntu-bold-italic";
  }

  .icon:hover {
    color: #666;
    cursor: pointer;
  }
  .fixedHeight45 {
    height: 45px;
  }
  .alert {
    color: #b20000;
    font-size: 14px;
    display: inline-block;
    float: right;
  }
  .alert:hover {
    color: #b20000;
    cursor: default;
  }
  .form-control:focus {
    border-color: #ccc;
    box-shadow: none;
  }

  .footer-text {
    color: #333;
    margin-left: 5px;
    font-size: 14px;
  }
  .header-arrow {
    position: absolute;
    top: 2px;
    left: 50%;
    margin-left: -5px;
    height: 10px;
    width: 10px;
    transform: rotate(45deg);
    background-color: #fefefe;
  }

  .window {
    position: absolute;
    top: 5px;
  }
`;
