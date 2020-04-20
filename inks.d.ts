interface Options {
  exclude: (key: string, val: any) => boolean
}
declare type ModifyProperty = (key: string, val: string) => string
declare const default_options: {
  exclude: () => boolean
}
declare function Inks(val: any, ctxt: any, options?: Options): any
declare let walkers: any
declare function walk(
  key: string,
  val: any,
  modify_property: ModifyProperty,
  options: Options
): any
declare function make_modify_property(
  ctxt: any,
  options: Options
): (key: string, val: string) => any
declare function replace_values(tm: string, ctxt: any): any
declare function handle_eval($vstr: string, $obj: object | null, $: object): any
