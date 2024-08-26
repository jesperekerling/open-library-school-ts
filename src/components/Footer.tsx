import React from 'react'

function Footer() {
  return (
    <footer className='container mx-auto text-center py-5 text-sm'>
        <p className='py-2'><a href="https://github.com/jesperekerling/open-library-school-ts" target='blank' className='hover:opacity-80'>Code for this project at Github</a> | Powered by <a href="https://openlibrary.org" target='blank' className='hover:opacity-80'>Open Library</a></p>
        © 2024 <a href="https://ekerling.com" target='blank' className='hover:opacity-80'>ekerling.com</a>
    </footer>
  )
}

export default Footer