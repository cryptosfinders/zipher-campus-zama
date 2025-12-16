'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingIndicator } from '@/components/feedback/loading-indicator'
import { toast } from 'sonner'

/**
 * Zipher Campus – FH-EVM Clean Dashboard
 * --------------------------------------
 * - Submit encrypted courses
 * - Read encrypted submissions from relayer
 * - Display ciphertext + timestamp
 */

const RELAYER_URL =
  process.env.NEXT_PUBLIC_RELAYER_URL || 'http://localhost:4002'

export default function ZipherCoursesShell() {
  const [ciphertext, setCiphertext] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch existing encrypted submissions
  async function loadCourses() {
    try {
      setLoading(true)
      const res = await fetch(`${RELAYER_URL}/api/submissions`)
      const data = await res.json()
      setCourses(data.reverse())
    } catch (e) {
      toast.error('Failed to load encrypted courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  // Register encrypted course
  async function submitEncryptedCourse() {
    if (!ciphertext.trim()) {
      toast.error('Enter ciphertext')
      return
    }

    try {
      setSubmitting(true)

      const res = await fetch(`${RELAYER_URL}/api/register-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-signer': 'zipher-campus' // metadata
        },
        body: JSON.stringify({ ciphertext })
      })

      const result = await res.json()
      toast.success(`Encrypted course submitted (#${result.id})`)
      setCiphertext('')
      loadCourses()
    } catch (err) {
      toast.error('Failed to submit encrypted course')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[--zipher-primary] via-background to-[--zipher-accent] px-6 py-12">
      {/* HEADER */}
      <div className="mx-auto max-w-4xl text-center space-y-4">
        <h1 className="text-5xl font-bold text-[--zipher-text] drop-shadow-sm">
          Zipher Campus
        </h1>
        <p className="text-lg text-[--zipher-text-muted]">
          Fully private FH-EVM encrypted course submissions.
        </p>
      </div>

      {/* SUBMIT FORM */}
      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-[--zipher-border]/40 bg-card/60 p-6 backdrop-blur-xl shadow-lg">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Submit Encrypted Course
        </h2>

        <Input
          placeholder="paste ciphertext here..."
          value={ciphertext}
          className="mb-4"
          onChange={(e) => setCiphertext(e.target.value)}
        />

        <Button
          disabled={submitting}
          className="w-full bg-[--zipher-primary] hover:bg-[--zipher-primary-dark]"
          onClick={submitEncryptedCourse}
        >
          {submitting ? 'Submitting…' : 'Submit Encrypted Course'}
        </Button>
      </div>

      {/* COURSE LIST */}
      <div className="mx-auto mt-12 max-w-4xl space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Encrypted Courses
        </h2>

        {loading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <LoadingIndicator />
          </div>
        )}

        {!loading && courses.length === 0 && (
          <p className="text-muted-foreground">No encrypted courses yet.</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[--zipher-border]/30 bg-card/70 p-5 backdrop-blur-md shadow-md"
            >
              <p className="text-sm text-muted-foreground">
                Course #{item.id} •{' '}
                {new Date(item.ts).toLocaleString()}
              </p>

              <pre className="mt-3 whitespace-pre-wrap break-all text-[--zipher-text] text-sm p-3 rounded-lg bg-muted/40">
                {item.ciphertext}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

