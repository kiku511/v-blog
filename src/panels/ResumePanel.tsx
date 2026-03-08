import { RESUME_PATH } from '../config/constants'

export function ResumePanel() {
  return (
    <iframe
      src={RESUME_PATH}
      style={{ display: 'block', width: '100%', height: '100%', border: 'none' }}
      title="Vansh Gambhir Resume"
    />
  )
}
