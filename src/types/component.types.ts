import { ReactElement, RefObject } from 'react'

export interface DelayedComponentTypes {
  children: ReactElement
  waitBeforeShow: number
}

interface FormDataType {
  name: string | null
  email: string | null
  comments: string | null
}

interface SubmitAPIResponsePropType {
  isSubmitting: boolean
  submitSuccess: boolean
  submitError: boolean
}

export interface FeedbackDialogType {
  open: boolean
  onClickDialogClose: () => void
  rating: number
  onClickAddImage: (value: boolean, formData: FormDataType) => void
  isScreenCaptured: boolean
  onClickRemoveImage: () => void
  onClickRetakeScreenshot: () => void
  initialFormData: FormDataType
  onClickSubmit: (data: FormDataType) => void
  submitAPIResponse: SubmitAPIResponsePropType
}

export interface FeedbackTextfieldType {
  inputRef: RefObject<any>
  label: string
  isComment?: boolean
  onChange?: (event: any) => void
  isError?: boolean
  errorText?: string
  value: string | null
}

interface IndicatorDataType {
  isRequired: boolean
  topLineHeight: number
}

export interface FieldIndicatorType {
  data: Array<IndicatorDataType>
}

export interface ToolButtonType {
  onclickTool: () => void
  icon: any
  isActive: boolean
}

export interface UXFeeedBackFloaterType {
  token: string
  appName: string
  workspaceCode: string
}
