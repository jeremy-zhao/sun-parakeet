import './index.css'

// Common
import Button from './common/Button.svelte'
export type { ButtonAttributes, ButtonTheme } from './common/Button.svelte'
import Icon from './common/Icon.svelte'
export type { IconAttributes, IconOption } from './common/Icon.svelte'
export { Button, Icon }
export { delay, isIOS, isWechatDevTools } from './common'

// Display
import Avatar from './display/Avatar.svelte'
export type { AvatarAttributes } from './display/Avatar.svelte'
import Badge from './display/Badge.svelte'
export type { BadgeAttributes } from './display/Badge.svelte'
import Collapse from './display/Collapse.svelte'
export type { CollapseAttributes } from './display/Collapse.svelte'
import Image from './display/Image.svelte'
export type { ImageAttributes } from './display/Image.svelte'
import List from './display/List.svelte'
export type { ListAttributes } from './display/List.svelte'
import ListItem from './display/ListItem.svelte'
export type { ListItemAttributes } from './display/ListItem.svelte'
import PageIndicator from './display/PageIndicator.svelte'
export type { PageIndicatorAttributes } from './display/PageIndicator.svelte'
import Steps from './display/Steps.svelte'
export type { StepsAttributes } from './display/Steps.svelte'
import Step from './display/Step.svelte'
export type { StepAttributes, StepStatus } from './display/Step.svelte'
import Swiper from './display/Swiper.svelte'
export type { SwiperAttributes } from './display/Swiper.svelte'
export { Avatar, Badge, Collapse, Image, List, ListItem }
export { PageIndicator, Steps, Step, Swiper }

// Feedback
import ActionSheet from './feedback/ActionSheet.svelte'
export type { ActionSheetAttributes } from './feedback/ActionSheet.svelte'
export { showLoading, hideLoading, type ShowLoadingOption } from './feedback/loading'
import Popup from './feedback/Popup.svelte'
export type { PopupAttributes, PopupPosition } from './feedback/Popup.svelte'
import PullToRefresh from './feedback/PullToRefresh.svelte'
export type { PullToRefreshAttributes } from './feedback/PullToRefresh.svelte'
export type { PullToRefreshState, PullToRefreshHeader } from './feedback/PullToRefresh.svelte'
import SwipeAction from './feedback/SwipeAction.svelte'
export type { SwipeActionAttributes, SwipeActionState } from './feedback/SwipeAction.svelte'
export { showToast, hideToast, type ShowToastOption } from './feedback/toast'
export { ActionSheet, Popup, PullToRefresh, SwipeAction }

// Input
import CheckList from './input/CheckList.svelte'
export type { CheckListAttributes } from './input/CheckList.svelte'
import CheckListItem from './input/CheckListItem.svelte'
export type { CheckListItemAttributes } from './input/CheckListItem.svelte'
import Checkbox from './input/Checkbox.svelte'
export type { CheckboxAttributes } from './input/Checkbox.svelte'
import CheckboxGroup from './input/CheckboxGroup.svelte'
export type { CheckboxGroupAttributes } from './input/CheckboxGroup.svelte'
import Form from './input/Form.svelte'
export type { FormAttributes } from './input/Form.svelte'
import FormItem from './input/FormItem.svelte'
export type { FormItemAttributes } from './input/FormItem.svelte'
import Input from './input/Input.svelte'
export type { InputAttributes } from './input/Input.svelte'
import Picker from './input/Picker.svelte'
export type { PickerAttributes } from './input/Picker.svelte'
import PickerView from './input/PickerView.svelte'
export type { PickerViewAttributes } from './input/PickerView.svelte'
import Stepper from './input/Stepper.svelte'
export type { StepperAttributes } from './input/Stepper.svelte'
import Switch from './input/Switch.svelte'
export type { SwitchAttributes } from './input/Switch.svelte'
import Textarea from './input/Textarea.svelte'
export type { TextareaAttributes } from './input/Textarea.svelte'
export { CheckList, CheckListItem, Checkbox, CheckboxGroup }
export { Form, FormItem, Input, Picker, PickerView, Stepper, Switch, Textarea }

// Layout
import AutoCenter from './layout/AutoCenter.svelte'
export type { AutoCenterAttributes } from './layout/AutoCenter.svelte'
import Divider from './layout/Divider.svelte'
export type { DividerAttributes } from './layout/Divider.svelte'
import Page from './layout/Page.svelte'
import Space from './layout/Space.svelte'
export type { SpaceAttributes } from './layout/Space.svelte'
export { AutoCenter, Divider, Page, Space }

// Navigation
import SideBar from './navigation/SideBar.svelte'
export type { SideBarAttributes } from './navigation/SideBar.svelte'
import TabBar from './navigation/TabBar.svelte'
export type { TabBarAttributes } from './navigation/TabBar.svelte'
import TabPanel from './navigation/TabPanel.svelte'
export type { TabPanelAttributes } from './navigation/TabPanel.svelte'
import Tabs from './navigation/Tabs.svelte'
export type { TabsAttributes } from './navigation/Tabs.svelte'
export { SideBar, TabBar, TabPanel, Tabs }
