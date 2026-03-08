import { RESUME_PATH, RESUME_FILENAME } from '../config/constants'

export function ResumePanel() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="resume-panel-bar">
        <a
          href={RESUME_PATH}
          download={RESUME_FILENAME}
          className="resume-panel-download"
          onClick={e => e.stopPropagation()}
        >
          ↓ Download Resume
        </a>
      </div>
      <iframe
        src={RESUME_PATH}
        style={{ display: 'block', width: '100%', flex: 1, border: 'none' }}
        title="Vansh Gambhir Resume"
      />
    </div>
  )
}
