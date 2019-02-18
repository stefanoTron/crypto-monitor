import { ipcRenderer, ipcMain } from "electron";
import PusherJS from "pusher-js";
import React, { Component } from "react";
import Header from "../components/Header";
import Options from "../components/Options";
import globalStyle from "../css/styles.js";
import GenericMain from "../components/GenericMain";

class BitstampMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btceur: 0,
      btcusd: 0,
      ltceur: 0,
      ltcusd: 0,
      etheur: 0,
      ethusd: 0
    };
  }
  componentDidMount() {
    this.props.checkIfOnline();

    this.pusherClient = new PusherJS("de504dc5763aeef9ff52", {
      encrypted: true
    });

    //subscribe to Bitstamp's channels
    this.channel = this.pusherClient.subscribe("live_trades_btceur");
    this.channelUsd = this.pusherClient.subscribe("live_trades");

    this.channelLtc = this.pusherClient.subscribe("live_trades_ltceur");
    this.channelLtcUsd = this.pusherClient.subscribe("live_trades_ltcusd");

    this.channelEth = this.pusherClient.subscribe("live_trades_etheur");
    this.channelEthUsd = this.pusherClient.subscribe("live_trades_ethusd");

    this.channel.bind("trade", data => this.handleUpdate(data, "btceur"));
    this.channelUsd.bind("trade", data => this.handleUpdate(data, "btcusd"));

    this.channelLtc.bind("trade", data => this.handleUpdate(data, "ltceur"));
    this.channelLtcUsd.bind("trade", data => this.handleUpdate(data, "ltcusd"));

    this.channelEth.bind("trade", data => this.handleUpdate(data, "etheur"));
    this.channelEthUsd.bind("trade", data => this.handleUpdate(data, "ethusd"));
  }

  componentWillUnmount() {
    this.channel.unbind();
    this.channelUsd.unbind();
    this.channelLtc.unbind();
    this.channelEth.unbind();
    this.channelLtcUsd.unbind();
    this.channelEthUsd.unbind();
    this.pusherClient.unsubscribe();
    this.pusherClient.disconnect();
  }

  handleUpdate = (data, coin) => {
    this.setState({
      [coin]: data.price_str
    });
    if (coin === this.props.store.get("defaultCoin")) {
      ipcRenderer.send("price-updated", { price: data.price_str, coin });
    }
  };

  render() {
    return (
      <div
        className={
          this.props.hide ? (
            "hide window-content slide-left"
          ) : (
            "window-content slide-left"
          )
        }
      >
        <div className="pane-group">
          <div className="pane">
            <GenericMain {...this.state} />
          </div>
        </div>
      </div>
    );
  }
}

export default BitstampMain;
