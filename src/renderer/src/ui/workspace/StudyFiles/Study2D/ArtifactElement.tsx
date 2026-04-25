'use client'

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle
} from '@/components/ai-elements/artifact'
import { CodeBlock } from '@/components/ai-elements/code-block'
import {
  CopyIcon,
  DownloadIcon,
  PlayIcon,
  RefreshCwIcon,
  ShareIcon,
  ZoomIn,
  ZoomInIcon,
  ZoomOut,
  Sparkles
} from 'lucide-react'
import { Streamdown } from 'streamdown'

// const handleRun = () => () => {
//   console.log('Run')
// }

const handleCopy = (plan) => () => {
  console.log('Copy')
}

export const ArtifactElement = ({
  title = '',
  description = '',
  plan,
  activate3D,
  zoomToggle = () => {}
}) => (
  <Artifact className="h-full w-full">
    <ArtifactHeader
      onClick={() => {
        zoomToggle()
      }}
      className={`${activate3D ? `bg-[white]` : 'bg-[#dbdbdb]'} transition-colors duration-500`}
    >
      <ArtifactTitle>{title}</ArtifactTitle>
      <ArtifactDescription>{description}</ArtifactDescription>
      <div className="flex items-center gap-2">
        <ArtifactActions>
          <ArtifactAction icon={Sparkles} label="Sparkles" onClick={() => {}} />
          <ArtifactAction
            icon={CopyIcon}
            label="Copy"
            onClick={handleCopy(plan)}
            // tooltip="Copy to clipboard"
          />
          {/*  */}
          {/* <ArtifactAction
            icon={RefreshCwIcon}
            label="Regenerate"
            onClick={handleRegenerate}
            tooltip="Regenerate content"
          />
          <ArtifactAction
            icon={DownloadIcon}
            label="Download"
            onClick={handleDownload}
            tooltip="Download file"
          />
          <ArtifactAction
            icon={ShareIcon}
            label="Share"
            onClick={handleShare}
            tooltip="Share artifact"
          /> */}
        </ArtifactActions>
      </div>
    </ArtifactHeader>
    <ArtifactContent className="p-0">
      <div className="p-3 text-sm">
        <Streamdown>{plan}</Streamdown>
      </div>
      {/* <CodeBlock className="border-none" code={code} language="python" showLineNumbers /> */}
    </ArtifactContent>
  </Artifact>
)

// export default Example;
