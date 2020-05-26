fetch('http://localhost:3000/api/counties')
  .then(resp => resp.json())
  .then(data => test(data)) 

function test(data) {
  console.log(data)
}
