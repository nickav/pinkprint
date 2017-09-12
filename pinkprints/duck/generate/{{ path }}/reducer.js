// Auto-generated
import { combineReducers } from 'react-redux'
{{#each files}}
import {{ snakecase this }} from './{{ snakecase this }}'
{{/each}}

export default combineReducers({
{{#each files}}
  {{ snakecase this }}
{{/each}}
})
