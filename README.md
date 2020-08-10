# react-widget-modal

模态对话框。

## 安装

`npm install --save react-widget-modal`

## 使用

[![Edit react-widget-modal](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/wizardly-mcnulty-3xz0jwzpv5?fontsize=14&hidenavigation=1&theme=dark)

```jsx
import Modal from 'react-widget-modal';
import 'react-widget-modal/cjs/style/index.css';

class App extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.showModal}>
          Open Modal
        </button>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);

```

### Interfaces

```ts
interface RenderOkButtonProps {
	children: React.ReactNode;
	onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

type RenderCancelButtonProps = RenderOkButtonProps;

interface ModalProps extends React.HTMLAttributes<any> {
	/** 样式前缀 */
	prefixCls?: string;
	/** 根样式 */
	rootClassName?: string;
	/** 模态框是否可见 */
	visible?: boolean;
	/** 是否显示右上角的关闭按钮 */
	closable?: boolean;
	/** 自定义关闭图标 */
	closeIcon?: React.ReactNode;
	/** 自定义关闭按按钮样式 */
	closeClassName?: string;
	/** 关闭时销毁Modal */
	destroyOnClose?: boolean;
	/** 是否全屏显示 */
	fullscreen?: boolean;
	/** 垂直居中展示 */
	centered?: boolean;
	/** 设置Modal的zIndex */
	zIndex?: number;
	/** 宽度 */
	width?: number | string;
	/** 标题 */
	title?: React.ReactNode;
	/** 显示时自动获得焦点 */
	autoFocus?: boolean;
	/** 锁定焦点在Modal框内切换 */
	enforceFocus?: boolean;
	/** 是否支持键盘 esc 关闭 */
	keyboard?: boolean;
	/** 当destroyOnClose关闭时，组件刷新时强制更新Modal组件 */
	forceRender?: boolean;
	/** Modal显示/关闭的CSSTransition参数，参考：react-transition-group */
	transition?: CSSTransitionProps;
	/** Modal外层容器的样式 */
	wrapStyle?: React.CSSProperties;
	/** Modal外层容器的组件属性 */
	wrapProps?: React.HTMLAttributes<any>;
	/** Modal外层容器的样式类名 */
	wrapClassName?: string;
	/** 是否展示遮罩 */
	mask?: boolean;
	/** 遮罩组件属性 */
	maskProps?: React.HTMLAttributes<any>;
	/** 遮罩组件样式 */
	maskStyle?: React.CSSProperties;
	/** 点击遮罩层是否允许关闭 */
	maskClosable?: boolean;
	/** 遮罩组件样式类 */
	maskClassName?: string;
	/** mask显示/关闭的CSSTransition参数，参考：react-transition-group */
	maskTransition?: CSSTransitionProps;
	/** Modal标题，优先级高于title，不需要标题是可设置为null */
	header?: React.ReactNode;
	/** 标题样式 */
	headerStyle?: React.CSSProperties;
	/** 标题样式类名 */
	headerClassName?: string;
	/** Modal容器样式 */
	bodyStyle?: React.CSSProperties;
	/** Modal容器样式类名 */
	bodyClassName?: string;
	/** Modal底部内容，不需要底部内容时可设置为null，默认会渲染确定/取消按钮 */
	footer?: React.ReactNode;
	/** 底部样式 */
	footerStyle?: React.CSSProperties;
	/** 底部样式类名 */
	footerClassName?: string;
	/** 确认按钮文字 */
	okText?: React.ReactNode;
	/** 确认 按钮 props */
	okButtonProps?: React.ButtonHTMLAttributes<any>;
	/** 自定义渲染确定按钮，建议进行二次封装使用 */
	renderOkButton?: (props: RenderOkButtonProps, modalProps: ModalProps) => React.ReactNode;
	/** 取消按钮文字 */
	cancelText?: React.ReactNode;
	/** 取消按钮props */
	cancelButtonProps?: React.ButtonHTMLAttributes<any>;
	/** 自定义渲染取消按钮，建议进行二次封装使用 */
	renderCancelButton?: (
		props: RenderCancelButtonProps,
		modalProps: ModalProps
	) => React.ReactNode;
	/** 点击确定回调 */
	onOk?: (e: React.MouseEvent<HTMLElement>) => void;
	/** 点击取消回调 */
	onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
	/** 完全关闭后的回调 */
	afterClose?: () => void;
	/** 设置Modal挂载容器，默认为document.body */
	getContainer?: () => HTMLElement | null;
}
```

### defaultProps

```js
{
    prefixCls: "rw-modal",
	visible: false,
	closable: true,
	closeIcon: "X",
	destroyOnClose: true,
	fullscreen: false,
	width: 520,
	autoFocus: true,
	enforceFocus: true,
	keyboard: true,
	centered: false,
	forceRender: false,

	transition: {
		classNames: "rw-modal",
		timeout: 300,
	},

	mask: true,
	maskClosable: true,
	maskTransition: {
		classNames: "rw-modal-mask",
		timeout: 300,
	},

	wrapProps: {},

	bodyStyle: {},

	getContainer() {
		return document.body;
	},

	okText: "确定",
	renderOkButton(props, modalProps) {
		return <button {...props} className="rw-btn rw-btn-primary" />;
	},
	cancelText: "取消",
	renderCancelButton(props, modalProps) {
		return <button {...props} className="rw-btn rw-btn" />;
	},
}
```

### 基础样式

```css
.rw-modal-root {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 0;
    overflow: visible;
    z-index: 1050;
}

.rw-modal-container {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}

.rw-modal-wrapper {
    position: absolute;
    width: 100%;
    min-height: 100%;
    outline: none;
}

.rw-modal-centered {
    display: flex;
    align-items: center;
    justify-content: center;
}

.rw-modal-centered .rw-modal {
    margin: 30px 0;
}

.rw-modal-wrapper:not(.rw-modal-centered) .rw-modal {
    margin: 0 auto;
    margin-bottom: 30px;
    top: 100px;
}

.rw-modal-wrapper-fullscreen {
    overflow: hidden;
    height: 100%;
}

.rw-modal-wrapper.rw-modal-wrapper-fullscreen .rw-modal {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: 0;
}

.rw-modal {
    position: relative;
    display: flex;
    flex-direction: column;
}

.rw-modal-content {
    position: relative;
    background-color: #fff;
    border-radius: 2px;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.rw-modal-mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.45);
}

.rw-modal-fixed,
.rw-modal-mask-fixed {
    position: fixed;
}

.rw-modal-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    padding: 0;
    color: rgba(0, 0, 0, 0.45);
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    background: 0 0;
    border: 0;
    /* outline: 0; */
    cursor: pointer;
    transition: color 0.3s;
}

.rw-modal-close-x {
    display: block;
    width: 56px;
    height: 56px;
    font-size: 16px;
    font-style: normal;
    line-height: 56px;
    text-align: center;
    text-transform: none;
    text-rendering: auto;
}

.rw-modal-header {
    padding: 16px 24px;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 2px 2px 0 0;
    flex: none;
}

.rw-modal-title {
    margin: 0;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
}

.rw-modal-body {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5715;
    word-wrap: break-word;
    flex: 1;
    overflow: auto;
}

.rw-modal-footer {
    padding: 10px 16px;
    text-align: right;
    background: 0 0;
    border-top: 1px solid #f0f0f0;
    border-radius: 0 0 2px 2px;
    flex: none;
}

/***animate***/
.rw-modal-appear,
.rw-modal-enter {
    opacity: 0.01;
    transform: translateY(-20px);
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}
.rw-modal-appear-active,
.rw-modal-enter-active {
    opacity: 1;
    transform: translateY(0);
}

.rw-modal-exit {
    opacity: 1;
    transform: translateY(0);
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}
.rw-modal-exit-active {
    opacity: 0.01;
    transform: translateY(-20px);
}

.rw-modal-mask-appear,
.rw-modal-mask-enter {
    opacity: 0.01;
    transition: opacity 0.3s ease-out;
}
.rw-modal-mask-appear-active,
.rw-modal-mask-enter-active {
    opacity: 1;
}
.rw-modal-mask-exit {
    opacity: 1;
    transition: opacity 0.3s ease-out;
}
.rw-modal-mask-exit-active {
    opacity: 0.01;
}

/***footer button***/
.rw-modal-footer button + button {
    margin-left: 8px;
}

.rw-btn {
    /* outline: 0; */
    line-height: 1.5715;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
    cursor: pointer;
    height: 32px;
    padding: 4px 15px;
    font-size: 14px;
    border-radius: 2px;
}

.rw-btn-primary {
    color: #fff;
    background-color: #1890ff;
    border-color: #1890ff;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
}

```
