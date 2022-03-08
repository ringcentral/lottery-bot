import { invoke, getName } from './invoke'

export function maintain (data) {
  const name = getName()
  return invoke(data, name)
}
