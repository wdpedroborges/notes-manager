import { Inter } from 'next/font/google'
import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { prisma } from '../../lib/prisma'
import router, { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

type FormType = {
  id: string
  title: string
  content: string
}

interface Notes {
  notes: {
    id: string
    title: string
    content: string
  }[]
}

export default function Home({ notes }: Notes) {
  const [form, setForm] = useState<FormType>({id: '', title: '', content: ''})
  const router = useRouter()

  const refreshData = () => {
    setForm({id: '', title: '', content: ''})
    router.replace(router.asPath)
  }

  const deleteNote = async (noteId: string) => {
    try {
      const response = await fetch('/api/note/' + noteId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        refreshData()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateNote = async () => {
    try {
      const response = await fetch('/api/note/' + form.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        refreshData()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      if (form.id === '') {
        const response = await fetch('/api/create', {
          body: JSON.stringify(form),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        })
  
        const data = await response.json()
        refreshData()
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className} bg-gray-900`}
    >
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Notes</span> Manager.</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-5 rounded-lg border border-gray-200">
        <label htmlFor="titleInput" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
        <input
          type="text" id="titleInput" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5" placeholder="Title"
          onChange={e => setForm({...form, title: e.target.value})}
          value={form.title}          
        />
        <label htmlFor="contentInput" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
        <input
          type="text" id="contentInput" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Content"
          onChange={e => setForm({...form, content: e.target.value})}
          value={form.content}      
        />
        <button type="submit" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Add</button>
        <button type="button" className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => updateNote()}>Update</button>
      </form>
      <div>
        <div className="w-screen lg:flex lg:flex-row lg:justify-around items-center sm:flex-col">
          {
            notes.map((note, index) => {
              return (
                <div key={index} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <a href="#">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{note.title}</h5>
                    </a>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{note.content}</p>
                    <button onClick={() => setForm({id: note.id, title: note.title, content: note.content})} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-4">
                        Update
                    </button>
                    <button onClick={() => deleteNote(note.id)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                        Delete
                    </button>
                </div>
              )
            })
          }
        </div>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const notes = await prisma.note.findMany({
      select: {
        title: true,
        id: true,
        content: true
      }
    })
  
    return {
      props: {
        notes
      }
    }    
  } catch (error) {
    return {
      props: {
        notes: []
      }
    }
  }
}