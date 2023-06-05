/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useMemo } from 'react'
import classNames from 'classnames'
import Backdrop from '@mui/material/Backdrop'
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline'

import Delayed from '../delayed/Delayed.component'
import FeedbackDialog from '../feedbackDialog/FeedbackDialog.component'
import Canvas from '../drawing/Canvas'

import cryingSVG from '../../images/crying.svg'
import disapointedSVG from '../../images/disapointed.svg'
import smilingSVG from '../../images/smiling.svg'
import whiteSmilingSVG from '../../images/whiteSmiling.svg'
import worriedSVG from '../../images/worried.svg'
import arrowSVG from '../../images/arrow.svg'

import { UXFeeedBackFloaterType } from '../../types/component.types'

import './UXFeeedBackFloater.css'

const initialFormData = {
  name: '',
  email: '',
  comments: '',
}

const UXFeeedBackFloater: React.FC<UXFeeedBackFloaterType> = ({ appName, workspaceCode, token }) => {
  const [isCollapse, setIsCollapse] = useState(true)
  const [rating, setRating] = useState(0)
  const [clickedAddImage, setClickedAddImage] = useState(false)
  const [imageData, setImageData] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<boolean>(false)

  const [formData, setFormData] = useState(initialFormData)

  const iconMap: any = useMemo(() => {
    return {
      1: cryingSVG,
      2: disapointedSVG,
      3: worriedSVG,
      4: whiteSmilingSVG,
      5: smilingSVG,
    }
  }, [])

  const handleClickFloatingButton = () => {
    if (isCollapse) {
      setIsCollapse(false)
    }
  }

  const handleClickEmoji = (rating: number) => {
    setRating(rating)
    setIsCollapse(true)
  }

  const handleClickAddImage = (value: any, formData: any) => {
    setClickedAddImage(value)
    setFormData(formData)
  }

  const handleClickScreenCapture = (imageData: any) => {
    setImageData(imageData)
    setClickedAddImage(false)
  }

  const getBase64StringFromDataURL = (dataURL: string) => dataURL.replace('data:', '').replace(/^.+,/, '')

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true)
    setSubmitError(false)
    setSubmitSuccess(false)
    const { comments, name: fullName, email } = formData
    try {
      const response = await fetch('https://nsldev.nimble.expert/AdminConsole/api/Feedback', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comments,
          email,
          fullName,
          screenshotData: imageData ? getBase64StringFromDataURL(imageData) : null,
          screenshotFileName: imageData ? appName : null,
          feedbackFiles: [],
          workspaceCode,
        }),
      })
      if (response.status === 200 || response.status === 201) {
        console.log('Feedback API Submit success', response)
        setSubmitSuccess(true)
      } else {
        throw new Error()
      }
    } catch (error) {
      setSubmitError(true)
      setSubmitSuccess(false)
      console.log('Feedback API Submit error')
    }

    setFormData(initialFormData)
    setIsSubmitting(false)
  }

  const handleDialogClose = () => {
    setRating(0)
    setImageData(null)
    setFormData(initialFormData)
  }

  return (
    <>
      <ScopedCssBaseline>
        <div
          className={classNames('floating-button', isCollapse === false && 'floating-button-clicked')}
          onClick={rating === 0 ? handleClickFloatingButton : () => {}}
        >
          {isCollapse ? (
            <>
              <div>Feed&#10;back</div>
            </>
          ) : (
            <Delayed waitBeforeShow={300}>
              <div className='detailed-container'>
                <div>
                  <div className='experience-text'>? How is your experience so far</div>
                  <div className='emojiWrapper'>
                    {Object.entries(iconMap).map((_key, index) => (
                      <img
                        key={index}
                        src={iconMap[index + 1]}
                        alt='cryingSVG'
                        className='emoji'
                        onClick={() => handleClickEmoji(index + 1)}
                      />
                    ))}
                  </div>
                </div>
                <img src={arrowSVG} alt='arrow' className='arrow' onClick={() => setIsCollapse(true)} />
              </div>
            </Delayed>
          )}
        </div>
        <FeedbackDialog
          open={rating > 0 && !clickedAddImage}
          onClickDialogClose={handleDialogClose}
          rating={rating}
          onClickAddImage={handleClickAddImage}
          isScreenCaptured={imageData ? true : false}
          onClickRemoveImage={() => setImageData(null)}
          onClickRetakeScreenshot={() => setClickedAddImage(true)}
          initialFormData={formData}
          onClickSubmit={handleSubmit}
          submitAPIResponse={{
            isSubmitting,
            submitSuccess,
            submitError,
          }}
        />
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0)',
          }}
          open={clickedAddImage}
        >
          {clickedAddImage && (
            <Canvas onClickCancel={() => setClickedAddImage(false)} onClickSave={handleClickScreenCapture} />
          )}
        </Backdrop>
      </ScopedCssBaseline>
    </>
  )
}

export default UXFeeedBackFloater
