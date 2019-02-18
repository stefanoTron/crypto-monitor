import React, { Component } from "react";
import globalStyle from "../css/styles.js";
import Header from "../components/Header";
import { ipcRenderer } from "electron";
import { translate } from "react-i18next";
import i18n from "i18next";
import Close from "@haiku/littletower-close/react";

class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSource: props.store.get("source"),
      selectedLang: props.store.get("lang"),
      startOnStartup: props.store.get("start"),
      selectedDefaultCoin: props.store.get("defaultCoin")
    };
  }

  selectDefaultCoin = event => {
    let coin = event.target.value;
    this.props.store.set("defaultCoin", coin);
    this.setState({
      selectedDefaultCoin: coin
    });
    ipcRenderer.send("image-updated", coin);
    ipcRenderer.send("price-updated", {
      price: "...",
      coin
    });
  };

  selectSource = event => {
    let source = event.target.value;
    this.props.store.set("source", source);
    this.setState({
      selectedSource: source
    });
  };

  selectLang = event => {
    let lang = event.target.value;
    this.props.store.set("lang", lang);
    i18n.changeLanguage(lang);
    this.setState({
      selectedLang: lang
    });
  };

  changeStartOnStartup = event => {
    const value = event.target.checked;
    this.setState({
      startOnStartup: value
    });
    this.props.store.set("start", value);
  };

  render() {
    return (
      <div
        className={
          this.props.hide ? (
            "hide window-content slide-right"
          ) : (
            "window-content slide-right"
          )
        }
      >
        <div className="pane-group">
          <div className="pane">
            <ul className="list-group">
              <li className="list-group-item">
                <form>
                  <div className="form-group">
                    <label>{this.props.t("language")} : </label>

                    <br />
                    <select
                      className="form-control"
                      onChange={this.selectLang}
                      value={this.state.selectedLang}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="pt">Português</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                      <option value="it">Italiano</option>
                      <option value="lb">Lëtzebuerg</option>
                    </select>
                  </div>
                  <br />
                  <div className="checkbox">
                    <label>
                      <input
                        type="checkbox"
                        /*!! casting value from null to false*/
                        checked={!!this.state.startOnStartup}
                        onChange={this.changeStartOnStartup}
                      />{" "}
                      {this.props.t("startup")}
                    </label>
                  </div>
                  <br />
                  <div className="form-group">
                    <label>{this.props.t("source")} : </label>
                    <br />
                    <select
                      className="form-control"
                      onChange={this.selectSource}
                      value={this.state.selectedSource}
                    >
                      <option value="bitstamp">Bitstamp</option>
                      <option value="coinbase">Coinbase Pro</option>
                      <option value="bitfinex">Bitfinex</option>
                    </select>
                  </div>
                  <br />
                  <div className="form-group">
                    <label>{this.props.t("defaultcurrency")} : </label>
                    <br />
                    <select
                      className="form-control"
                      onChange={this.selectDefaultCoin}
                      value={this.state.selectedDefaultCoin}
                    >
                      <option value="btceur">BTC/EUR</option>
                      <option value="btcusd">BTC/USD</option>
                      <option value="etheur">ETH/EUR</option>
                      <option value="ethusd">ETH/USD</option>
                      <option value="ltceur">LTC/EUR</option>
                      <option value="ltcusd">LTC/USD</option>
                    </select>
                  </div>
                  <br />
                </form>
              </li>
              <li className="list-group-item fixedHeight45">
                <div className="closeIcon">
                  <Close
                    contextMenu="disabled"
                    loop={true}
                    onClick={this.props.quitApp}
                    sizing="contain"
                    states={{
                      hoverLineColor: { value: "#990000" },
                      lineWidth: { value: "20" },
                      lineColor: { value: "#000" }
                    }}
                  />
                </div>
                {!this.props.onLine ? (
                  <span className="icon icon-attention alert">
                    <span className="footer-text">
                      {this.props.t("internet")}
                    </span>
                  </span>
                ) : null}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default translate(["translations"])(Options);
