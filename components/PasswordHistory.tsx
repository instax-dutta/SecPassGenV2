'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Trash2, Copy, Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getHistory, clearHistory, isHistoryAvailable, addToHistory, HISTORY_CHANGED } from '@/lib/passwordHistory'
import type { PasswordHistoryItem } from '@/lib/passwordHistory'

interface PasswordHistoryProps {
    isDarkMode: boolean
}

export default function PasswordHistory({ isDarkMode }: PasswordHistoryProps) {
    const [history, setHistory] = useState<PasswordHistoryItem[]>([])
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [isAvailable, setIsAvailable] = useState(false)

    useEffect(() => {
        setIsAvailable(isHistoryAvailable())
        if (isHistoryAvailable()) {
            loadHistory()
        }
    }, [])

    // The generator writes history from outside this component, so without this
    // the panel stayed on "No history yet" forever while the page claimed an
    // encrypted local history. That contradiction is worse than no panel.
    useEffect(() => {
        const onChange = () => { loadHistory() }
        window.addEventListener(HISTORY_CHANGED, onChange)
        window.addEventListener('storage', onChange)
        return () => {
            window.removeEventListener(HISTORY_CHANGED, onChange)
            window.removeEventListener('storage', onChange)
        }
    }, [])

    const loadHistory = async () => {
        const items = await getHistory()
        setHistory(items)
    }

    const handleClear = () => {
        clearHistory()
        toast.success('History cleared')
    }

    const handleCopy = async (password: string, id: string) => {
        try {
            await navigator.clipboard.writeText(password)
            setCopiedId(id)
            toast.success('Copied')
            setTimeout(() => setCopiedId(null), 2000)
        } catch (error) {
            toast.error('Failed to copy')
        }
    }

    const formatTime = (timestamp: number) => {
        const now = Date.now()
        const diff = now - timestamp
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)

        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        return new Date(timestamp).toLocaleDateString()
    }

    if (!isAvailable) {
        return null
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`flex h-full min-h-[240px] flex-col rounded-2xl border p-6 backdrop-blur-xl ${isDarkMode
                    ? 'bg-black/40 border-white/10'
                    : 'bg-white/60 border-black/10'
                }`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <History className={`h-4 w-4 ${isDarkMode ? 'text-white/60' : 'text-black/60'}`} />
                    <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white/90' : 'text-black/90'}`}>
                        Recent
                    </h3>
                </div>
                {history.length > 0 && (
                    <Button
                        onClick={handleClear}
                        variant="ghost"
                        size="sm"
                        className={`h-7 px-2 ${isDarkMode
                                ? 'hover:bg-white/10 text-white/60 hover:text-white/60'
                                : 'hover:bg-black/10 text-black/60 hover:text-black/60'
                            }`}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                )}
            </div>

            <div className="custom-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                    {history.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`text-center py-8 text-xs ${isDarkMode ? 'text-white/60' : 'text-black/60'
                                }`}
                        >
                            No history yet
                        </motion.div>
                    ) : (
                        history.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                className={`group p-3 rounded-lg border transition-all duration-200 ${isDarkMode
                                        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                        : 'bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-mono text-xs truncate ${isDarkMode ? 'text-white/70' : 'text-black/70'
                                            }`}>
                                            {item.password}
                                        </div>
                                        <div className={`flex items-center gap-2 mt-1 text-[10px] ${isDarkMode ? 'text-white/60' : 'text-black/60'
                                            }`}>
                                            <Clock className="h-2.5 w-2.5" />
                                            {formatTime(item.timestamp)}
                                            <span>•</span>
                                            <span>{item.length} chars</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleCopy(item.password, item.id)}
                                        variant="ghost"
                                        size="sm"
                                        className={`h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${copiedId === item.id
                                                ? 'bg-green-500/20 text-green-500'
                                                : isDarkMode
                                                    ? 'hover:bg-white/10 text-white/60'
                                                    : 'hover:bg-black/10 text-black/60'
                                            }`}
                                    >
                                        {copiedId === item.id ? (
                                            <Check className="h-3 w-3" />
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className={`mt-4 pt-4 border-t text-[10px] ${isDarkMode ? 'border-white/10 text-white/60' : 'border-black/10 text-black/60'
                }`}>
                Encrypted locally • Auto-expires in 24h
            </div>
        </motion.div>
    )
}

// Export the type for use in passwordHistory.ts
export type { PasswordHistoryItem }
