import React from "react";
import Modal from "../../src";

export default class Demo1 extends React.Component {
	state = {
		visible: true,
		visible2: false,
		fullscreen: false,
	};

	handleShow = () => {
		this.setState({
			fullscreen: false,
			visible: true,
		});
	};

	handleShow2 = () => {
		this.setState({
			visible2: true,
		});
	};

	handleHide = () => {
		this.setState({
			visible: false,
		});
	};

	handleHide2 = () => {
		this.setState({
			visible2: false,
		});
	};

	handleFull = () => {
		this.setState({
			visible: true,
			fullscreen: true,
		});
	};

	render() {
		return (
			<div>
				<button onClick={this.handleShow}>显示</button>
				<button onClick={this.handleFull}>全屏</button>
				<Modal
					fullscreen={this.state.fullscreen}
					title="Basic Modal"
					mask
					visible={this.state.visible}
					centered={false}
					onCancel={this.handleHide}
					onOk={this.handleHide}
				>
					<div
						style={{
							height: 300,
						}}
					>
						<button onClick={this.handleShow2}>打开第二个Modal</button>
						<input />
						<Modal
							visible={this.state.visible2}
							centered
							onCancel={this.handleHide2}
							onOk={this.handleHide2}
						>
							asdfasdf
						</Modal>
					</div>
				</Modal>
			</div>
		);
	}
}
