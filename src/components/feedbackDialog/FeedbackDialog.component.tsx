import React, { useRef, useState, useEffect } from 'react'
import { Dialog, IconButton, useMediaQuery, CircularProgress } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

import FieldIndicator from '../fieldIndicator/FieldIndicator.component'
import FeedbackTextfield from '../feedbackTextfield/FeedbackTextfield.component'

import cameraSVG from '../../images/camera.svg'
import cameraActiveSVG from '../../images/camera-active.svg'
import doneSVG from '../../images/done.svg'

import './FeedbackDialog.css'
import { FeedbackDialogType } from '../../types/component.types'

const indicatorData = [
  { isRequired: false, topLineHeight: 0 },
  { isRequired: false, topLineHeight: 48 },
  { isRequired: true, topLineHeight: 50 },
  { isRequired: false, topLineHeight: 140 },
]

const FeedbackDialog: React.FC<FeedbackDialogType> = ({
  open,
  onClickDialogClose,
  onClickAddImage,
  isScreenCaptured,
  onClickRemoveImage,
  onClickRetakeScreenshot,
  initialFormData,
  onClickSubmit,
  submitAPIResponse,
}: FeedbackDialogType) => {
  const [emailError, setEmailError] = useState(true)
  const [submitClicked, setSubmitClicked] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const nameRef = useRef<any>(null)
  const emailRef = useRef<any>(null)
  const commentRef = useRef<any>(null)

  useEffect(() => {
    if (open) {
      setFormSubmitted(false)
    }
  }, [open])

  const handleClose = () => {
    setSubmitClicked(false)
    onClickDialogClose()
  }

  const handleSave = () => {
    setSubmitClicked(true)
    if (!emailError && commentRef?.current?.value) {
      setFormSubmitted(true)
      onClickSubmit({
        name: nameRef.current.value,
        email: emailRef.current.value,
        comments: commentRef.current.value,
      })
    }
  }

  const isValidEmail = (email: string) => {
    return email ? /\S+@\S+\.\S+/.test(email) : true
  }

  const onChangeEmail = (event: any) => {
    setEmailError(!isValidEmail(event.target.value))
  }

  const handleClickAddImage = () => {
    const formData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      comments: commentRef.current.value,
    }
    onClickAddImage(true, formData)
  }

  return (
    <>
      <Dialog
        open={open}
        PaperProps={{
          style: { borderRadius: fullScreen ? 0 : 25 },
        }}
        fullScreen={fullScreen}
      >
        <div className='feedback-form-dialog-container'>
          <div className='feedback-form-header-wrapper'>
            {!formSubmitted ? (
              <div>
                <div className='feedback-form-header-text'>Feedback form</div>
                <div className='feedback-form-header-sub-text'>
                  For future improvements, we would really love to get some feedback from you!
                </div>
                <div className='feedback-form-required-wrapper'>
                  <div className='feedback-form-required-circle' />
                  <div className='feedback-form-required-text'>= Required</div>
                </div>
              </div>
            ) : (
              <div />
            )}
            <IconButton onClick={handleClose} size='large'>
              <CloseIcon className='feedback-form-dialog-close-button' />
            </IconButton>
          </div>
          {!formSubmitted ? (
            <>
              <div className='feedback-form-inputs-container'>
                <FieldIndicator data={indicatorData} />
                <div className='feedback-form-inputs-right-container'>
                  <FeedbackTextfield inputRef={nameRef} label='Name' value={initialFormData.name} />
                  <FeedbackTextfield
                    inputRef={emailRef}
                    label='Email'
                    onChange={onChangeEmail}
                    isError={submitClicked && emailError}
                    errorText={'Enter valid email id'}
                    value={initialFormData.email}
                  />
                  <FeedbackTextfield
                    inputRef={commentRef}
                    label='Comments'
                    isComment
                    isError={submitClicked && !commentRef.current.value}
                    errorText='Required'
                    value={initialFormData.comments}
                  />
                  <div className='feedback-form-inputs-wrapper'>
                    <div className='feedback-form-add-photo-wrapper'>
                      <div className='feedback-form-add-photo-leftbox'>
                        <img
                          src={isScreenCaptured ? cameraActiveSVG : cameraSVG}
                          alt='cameraSVG'
                          className='feedback-form-camera-iamge'
                          onClick={handleClickAddImage}
                        />
                        <div className='feedback-form-add-photo-text'>
                          {isScreenCaptured
                            ? 'Screenshot was added!'
                            : 'Add a screenshot of your current page and visualize your improvements'}
                        </div>
                      </div>
                      {isScreenCaptured && (
                        <div className='feedback-screen-edit-remove-panel'>
                          <div className='feedback-screen-remove-button' onClick={onClickRemoveImage}>
                            Remove
                          </div>
                          <div className='feedback-screen-edit-button' onClick={onClickRetakeScreenshot}>
                            Retake
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='feedback-form-submit-wrapper'>
                <div className='feedback-form-submit-button' onClick={handleSave}>
                  {!submitAPIResponse.isSubmitting ? (
                    <div>Send</div>
                  ) : (
                    <div>
                      Sending &nbsp;
                      <CircularProgress size={20} sx={{ color: '#FFF' }} />
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className='feedback-dialog-thank-wrapper'>
              {submitAPIResponse.submitSuccess && (
                <div>
                  <img src={doneSVG} alt='done' className='done-image' />
                </div>
              )}
              <div className='feedback-dialog-thank-text'>
                {(submitAPIResponse.submitSuccess || submitAPIResponse.isSubmitting) &&
                  'Thank you for your feedback! We really appreciate it'}
                {submitAPIResponse.submitError &&
                  'Oops error saving your feedback! Something went Wrong Please try again'}
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  )
}

export default FeedbackDialog
