import React from "react";
import ReactDOM, { findDOMNode } from "react-dom";
import classnames from "classnames";
import omit from "lodash/omit";
import getScrollbarSize from "dom-helpers/scrollbarSize";
import getScrollParent from "dom-helpers/scrollParent";
import contains from "dom-helpers/contains";
import isDocument from "dom-helpers/isDocument";
import { Popup, PopupProps } from "react-widget-popup";

export const version = "%VERSION%";

const KeyCode = {
	TAB: 9,
	ESC: 27,
};

export interface RenderOkButtonProps {
	children: React.ReactNode;
	onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export type RenderCancelButtonProps = RenderOkButtonProps;

export interface ModalProps extends Omit<React.HTMLAttributes<any>, "title"> {
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
	transition?: PopupProps["transition"];
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
	maskTransition?: PopupProps["maskTransition"];
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

const defaultProps: ModalProps = {
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
};

export class Modal extends React.Component<ModalProps, {}> {
	static defaultProps = defaultProps;

	protected containerElement: HTMLElement | null;
	protected wrapperElement: HTMLElement | null;
	protected sentinelEndElement: HTMLElement | null;
	protected lastOutSideFocusElement: HTMLElement | null;

	protected refHandlers = {
		container: (node: React.ReactInstance | null) =>
			(this.containerElement = node as HTMLElement),
		wrapper: (node: React.ReactInstance | null) => (this.wrapperElement = node as HTMLElement),
		sentinelEnd: (node: React.ReactInstance | null) =>
			(this.sentinelEndElement = node as HTMLElement),
	};

	protected getPopupRestProps(): React.DetailedHTMLProps<any, any> {
		const pKeys: Array<keyof ModalProps> = [
			"prefixCls",
			"rootClassName",
			"visible",
			"closable",
			"closeIcon",
			"closeClassName",
			"destroyOnClose",
			"centered",
			"zIndex",
			"width",
			"title",
			"transition",
			"wrapStyle",
			"wrapProps",
			"wrapClassName",
			"mask",
			"maskProps",
			"maskStyle",
			"maskClosable",
			"maskClassName",
			"maskTransition",
			"header",
			"headerStyle",
			"headerClassName",
			"bodyStyle",
			"bodyClassName",
			"footer",
			"footerStyle",
			"footerClassName",
			"okText",
			"renderOkButton",
			"cancelText",
			"renderCancelButton",
			"getContainer",
			"onOk",
			"onCancel",
			"autoFocus",
			"enforceFocus",
			"keyboard",
			"afterClose",
			"forceRender",
			"fullscreen",
			"okButtonProps",
			"cancelButtonProps",
		];

		return omit(this.props, pKeys);
	}

	renderCloseBtn() {
		const { prefixCls, closable, closeIcon, closeClassName } = this.props;

		if (!closable) {
			return null;
		}

		return (
			<button
				className={classnames(`${prefixCls}-close`, closeClassName)}
				onClick={this.handleCancel}
			>
				<span className={`${prefixCls}-close-x`}>{closeIcon}</span>
			</button>
		);
	}

	renderHeader() {
		const { prefixCls, header, title, headerClassName, headerStyle } = this.props;

		if (header === null) return null;

		if (!title && header === undefined) return null;

		const defaultHeader = <div className={`${prefixCls}-title`}>{title}</div>;

		return (
			<div className={classnames(`${prefixCls}-header`, headerClassName)} style={headerStyle}>
				{header === undefined ? defaultHeader : header}
			</div>
		);
	}

	renderBody() {
		const { prefixCls, children, bodyClassName, bodyStyle } = this.props;

		return (
			<div className={classnames(`${prefixCls}-body`, bodyClassName)} style={bodyStyle}>
				{children}
			</div>
		);
	}

	renderFooter() {
		const {
			prefixCls,
			footer,
			footerClassName,
			footerStyle,
			okText,
			cancelText,
			renderOkButton,
			renderCancelButton,
			okButtonProps,
			cancelButtonProps,
		} = this.props;

		if (footer === null) return null;

		const defaultFooter = (
			<div>
				{renderCancelButton!(
					{
						...cancelButtonProps,
						children: cancelText,
						onClick: this.handleCancelButtonClick,
					},
					this.props
				)}
				{renderOkButton!(
					{
						...okButtonProps,
						children: okText,
						onClick: this.handleOkButtonClick,
					},
					this.props
				)}
			</div>
		);

		return (
			<div className={classnames(`${prefixCls}-footer`, footerClassName)} style={footerStyle}>
				{footer === undefined ? defaultFooter : footer}
			</div>
		);
	}

	handleCancelButtonClick = (e: React.MouseEvent<HTMLElement>) => {
		this.props.cancelButtonProps?.onClick?.(e);
		this.handleCancel(e);
	};

	handleOkButtonClick = (e: React.MouseEvent<HTMLElement>) => {
		this.props.okButtonProps?.onClick?.(e);
		this.handleOk(e);
	};

	handleCancel = (e: React.MouseEvent<HTMLElement>) => {
		this.props.onCancel?.(e);
	};

	handleOk = (e: React.MouseEvent<HTMLElement>) => {
		this.props.onOk?.(e);
	};

	protected getScrollParent(): HTMLElement & Record<string, any> {
		const scrollParent = getScrollParent(findDOMNode(this) as HTMLElement) as HTMLElement;
		return isDocument(scrollParent) ? document.documentElement : scrollParent;
	}

	handleEnter = (node: HTMLElement, isAppearing: boolean) => {
		const { transition } = this.props;

		if (transition && transition.onEnter) {
			transition.onEnter(node, isAppearing);
		}

		const scrollParent = this.getScrollParent();

		scrollParent.__Popup_ResetStyleCounter = scrollParent.__Popup_ResetStyleCounter || 0;
		scrollParent.__Popup_ResetStyleCounter++;

		//window.innerWidth > document.body.clientWidth;
		const hasScroll = scrollParent.scrollHeight > scrollParent.clientHeight;

		if (!scrollParent.___Popup_ResetStyle) {
			const oldPaddingRight = scrollParent.style.paddingLeft;
			const oldOverflow = scrollParent.style.overflow;

			scrollParent.style.overflow = "hidden";
			if (hasScroll) {
				scrollParent.style.paddingRight = getScrollbarSize() + "px";
			}

			scrollParent.___Popup_ResetStyle = () => {
				delete scrollParent.__Popup_ResetStyleCounter;
				delete scrollParent.___Popup_ResetStyle;
				scrollParent.style.overflow = oldOverflow;
				if (hasScroll) {
					scrollParent.style.paddingRight = oldPaddingRight;
				}
			};
		}
	};

	// handleEntered = (node: HTMLElement, isAppearing: boolean) => {
	// 	const { transition } = this.props;

	// 	if (transition && transition.onEntered) {
	// 		transition.onEntered(node, isAppearing);
	// 	}
	// };

	handleExited = (node: HTMLElement) => {
		const { transition, afterClose } = this.props;

		if (transition && transition.onExited) {
			transition.onExited(node);
		}

		if (afterClose) {
			afterClose();
		}

		const scrollParent = this.getScrollParent();

		scrollParent.__Popup_ResetStyleCounter--;

		if (scrollParent.__Popup_ResetStyleCounter <= 0) {
			this.resetPopupContainerStyle();
		}
	};

	handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const { enforceFocus, keyboard, visible } = this.props;
		if (keyboard && e.keyCode === KeyCode.ESC) {
			e.stopPropagation();
			this.handleCancel(e as any);
			return;
		}

		//keep focus
		if (visible && enforceFocus) {
			if (e.keyCode === KeyCode.TAB) {
				const activeElement = document.activeElement;
				const sentinelEndElement = this.sentinelEndElement;

				if (activeElement === sentinelEndElement) {
					this.wrapperElement?.focus();
				}
			}
		}
	};

	focus() {
		const activeElement = document.activeElement;

		if (!this.wrapperElement || !this.props.visible) {
			return;
		}

		if (!contains(this.wrapperElement, activeElement as HTMLElement)) {
			this.wrapperElement.focus();
		}
	}

	componentDidMount() {
		this.lastOutSideFocusElement = document.activeElement as HTMLElement;
		this.componentDidUpdate(this.props);
	}

	componentDidUpdate(prevProps: ModalProps) {
		const { autoFocus, visible } = this.props;

		// show
		if (visible && !prevProps.visible) {
			this.lastOutSideFocusElement = document.activeElement as HTMLElement;

			if (autoFocus) {
				this.focus();
			}
		}

		// hide
		if (!visible && prevProps.visible) {
			if (this.lastOutSideFocusElement) {
				try {
					this.lastOutSideFocusElement.focus();
				} finally {
					this.lastOutSideFocusElement = null;
				}
			}
		}
	}

	componentWillUnmount() {
		if (this.props.visible) {
			this.resetPopupContainerStyle();
		}
	}

	resetPopupContainerStyle() {
		const scrollParent = this.getScrollParent();

		if (scrollParent.__Popup_ResetStyleCounter != null) {
			scrollParent.__Popup_ResetStyleCounter--;
			if (scrollParent.__Popup_ResetStyleCounter <= 0 && scrollParent.___Popup_ResetStyle) {
				scrollParent.___Popup_ResetStyle();
			}
		}
	}

	wrapPopupContent = (node: React.ReactNode) => {
		const {
			prefixCls,
			centered,
			maskClosable,
			wrapClassName,
			wrapStyle,
			wrapProps,
			fullscreen,
		} = this.props;
		return (
			<div className={`${prefixCls}-container`} ref={this.refHandlers.container}>
				<div
					ref={this.refHandlers.wrapper}
					tabIndex={0}
					{...wrapProps}
					className={classnames(
						{
							[`${prefixCls}-wrapper`]: true,
							[`${prefixCls}-wrapper-fullscreen`]: fullscreen,
							[`${prefixCls}-centered`]: centered && !fullscreen,
						},
						wrapClassName
					)}
					style={{
						...wrapStyle,
						...wrapProps!.style,
					}}
					onKeyDown={this.handleKeyDown}
					onClick={e => {
						wrapProps!.onClick?.(e);
						if (maskClosable && e.target === e.currentTarget) {
							this.handleCancel(e);
						}
					}}
				>
					{node}
				</div>
			</div>
		);
	};

	render() {
		const {
			getContainer,
			rootClassName,
			prefixCls,
			className,
			visible,
			zIndex,
			style,
			width,
			forceRender,
			transition,
			fullscreen,
			mask,
			maskProps,
			maskStyle,
			maskClassName,
			maskTransition,
			destroyOnClose,
		} = this.props;
		const mountNode = getContainer!();
		const node = (
			<Popup
				{...this.getPopupRestProps()}
				prefixCls={prefixCls}
				rootClassName={classnames(`${prefixCls}-root`, rootClassName)}
				rootStyle={{
					zIndex,
				}}
				forceRender={forceRender}
				destroyOnClose={destroyOnClose}
				visible={visible}
				fixed={false}
				className={classnames(
					{
						[`${prefixCls}-fullscreen`]: fullscreen,
					},
					className
				)}
				style={{
					width: fullscreen ? "" : width,
					...style,
				}}
				transition={{
					...transition,
					onEnter: this.handleEnter,
					// onEntered: this.handleEntered,
					onExited: this.handleExited,
				}}
				disableMask={fullscreen}
				mask={mask}
				maskClassName={maskClassName}
				maskProps={maskProps}
				maskStyle={maskStyle}
				maskTransition={maskTransition}
				wrapContent={this.wrapPopupContent}
			>
				{this.renderCloseBtn()}
				<div className="rw-modal-content">
					{this.renderHeader()}
					{this.renderBody()}
					{this.renderFooter()}
				</div>
				<div
					ref={this.refHandlers.sentinelEnd}
					tabIndex={0}
					aria-hidden="true"
					style={{
						width: 0,
						height: 0,
						overflow: "hidden",
						outline: "none",
					}}
				></div>
			</Popup>
		);

		return mountNode ? ReactDOM.createPortal(node, mountNode) : node;
	}
}

export default Modal;
