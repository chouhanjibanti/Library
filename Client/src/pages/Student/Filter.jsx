import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { useState } from 'react';

const categories = [
    { id: "nextjs", label: "Next JS" },
    { id: "Data Science", label: "Data Science" },
    { id: "frontend development", label: "Frontend Development" },
    { id: "fullstack development", label: "Fullstack Development" },
    { id: "mern stack development", label: "MERN Stack Development" },
    { id: "backend development", label: "Backend Development" },
    { id: "Javascript", label: "Javascript" },
    { id: "Python", label: "Python" },
    { id: "Docker", label: "Docker" },
    { id: "MongoDB", label: "MongoDB" },
    { id: "HTML", label: "HTML" },
];
function Filter({handelFilterChange}) {

    const [selectedCategories, setSelectedCategories] = useState([])
    const [sortByPrice, setSortByPrice] = useState("")
  
     const handleCategoryChange = (categoryId) => {
         setSelectedCategories((prevCategories)=>{
          const newCategories = prevCategories.includes(categoryId)
           ? prevCategories.filter((id)=> id !== categoryId)
           : [...prevCategories,categoryId]
            handelFilterChange(newCategories,sortByPrice)
            return newCategories
         })
     }
     const selectByPriceHandler = (selectedValue) =>{
        setSortByPrice(selectedValue)
        handelFilterChange(selectedCategories,selectedValue)
     }
  return (
    <>
        <div className='w-full md:w-[20%]'>
            <div className='flex items-center justify-between'>
               <h1 className='font-semibold text-lg md:text-xl'>Filter Options</h1>
                <Select onValueChange={selectByPriceHandler}>
                    <SelectTrigger>
                        <SelectValue placeholder='Sort by'/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort by Price</SelectLabel>
                            <SelectItem value='low'>Low to High</SelectItem>
                            <SelectItem value='high'>High to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Separator className='my-4'/>
            <div>
                <h1 className='font-semibold'>Category</h1>
                    {
                        categories.map((category)=>(
                            <div key={category.id} className='flex items-center my-2 gap-2'>
                              <Checkbox id={category.id} onCheckedChange={()=>handleCategoryChange(category?.id)}/>
                              <Label className='leading-none font-medium text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ' htmlFor={category.id}>
                                    {category.label}
                              </Label>
                            </div>
                        ))
                    }
            </div>
        </div>
    </>
  )
}

export default Filter