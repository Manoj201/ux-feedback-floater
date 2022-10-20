import React, { RefObject } from 'react'
import TextField from '@mui/material/TextField'
import './FeedbackTextfield.css'

interface FeedbackTextfieldType {
  inputRef: RefObject<any>
  label: string
  isComment?: boolean
  onChange?: (event: any) => void
  isError?: boolean
  errorText?: string
  value: string | null
}

const FeedbackTextfield: React.FC<FeedbackTextfieldType> = ({
  inputRef,
  label,
  isComment,
  onChange,
  isError,
  errorText,
  value,
}: FeedbackTextfieldType) => {
  return (
    <div className='feedback-form-inputs-wrapper'>
      <div className={isComment ? 'feedback-form-inputs-label-comments' : 'feedback-form-inputs-label'}>
        {label}
        {isError && <div className='error-text'>( {errorText} )</div>}
      </div>
      <TextField
        defaultValue={value}
        id={`feedback-form-name-input-${label}`}
        variant={isComment ? 'outlined' : 'standard'}
        size='small'
        style={{ width: '100%' }}
        inputRef={inputRef}
        inputProps={{
          style: { color: 'white' },
        }}
        sx={{
          '& .MuiInput-underline:before': {
            borderBottomColor: '#fff',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#fff',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          },
        }}
        multiline={isComment}
        {...(isComment && { rows: 4 })}
        {...(onChange && { onChange: onChange })}
      />
    </div>
  )
}

export default FeedbackTextfield
