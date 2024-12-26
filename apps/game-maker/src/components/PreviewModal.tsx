import { motion, AnimatePresence } from 'framer-motion'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
}

const ANIMATION_DURATION = 0.2

export function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION_DURATION }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* 预览窗口 */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: ANIMATION_DURATION }}
            className="fixed top-[5vh] left-[5vw] right-[5vw] bottom-[5vh] bg-[#111] rounded-lg shadow-xl overflow-hidden z-50"
          />
        </>
      )}
    </AnimatePresence>
  )
} 