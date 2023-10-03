export function loginReducer(state: any, action: any) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.fieldName]: action.value };
    default:
      return state;
  }
}
