import debug from "./debug"
import line from "./line"
import graphql from "./graphql"

export default function services() {
  this.configure(debug)
  this.configure(line)
  this.configure(graphql)
}
