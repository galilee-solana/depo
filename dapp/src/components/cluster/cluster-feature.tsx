'use client'

import { useState } from 'react'
import { ClusterUiTable } from './cluster-ui'

export default function ClusterFeature() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <ClusterUiTable />
    </div>
  )
}
