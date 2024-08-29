import React from 'react'
import Link from 'next/link'

function Header() {
  return (
    <header className='container mx-auto py-10'>
      <span className="text-xl font-bold">
        <Link href="/">
          BookSearcher
        </Link>
      </span>
    </header>
  )
}

export default Header