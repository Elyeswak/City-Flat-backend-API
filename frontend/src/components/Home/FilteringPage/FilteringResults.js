import React from 'react'

function FilteringResults({ filteredData }) {
  return (
    <div>
       <div>
      {filteredData.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          {/* render other item details here */}
        </div>
      ))}
    </div>
    </div>
  )
}

export default FilteringResults