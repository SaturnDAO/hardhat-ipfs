import all from 'it-all'
import { BlockstoreAdapter } from 'interface-blockstore'
import { importer } from 'ipfs-unixfs-importer'
import { toString as str } from 'uint8arrays/to-string'
import { concat as cnc } from 'uint8arrays/concat'

import type { AddResult } from 'ipfs-core-types/types/src/root'
import type { CID } from 'ipfs-http-client'
import type { IPFSHTTPClient } from 'ipfs-http-client/types/src/types'

export interface AddFolderResult extends Omit<AddResult, 'cid'> {
  cid: string
}

export async function addFolder (client: IPFSHTTPClient, path: string, pattern: string) {
  const results: AddFolderResult[] = []
  const { globSource } = await import('ipfs-http-client')

  for await (const file of client.addAll(globSource(path, pattern))) {
    results.push({ ...file, cid: file.cid.toString() })
  }

  return results
}

export async function hashCID (content: any) {
  const block = new BlockstoreAdapter()

  let lastCid!: CID

  if (typeof content === 'string') {
    content = new TextEncoder().encode(content)
  }

  for await (const { cid } of importer([{ content }], block, { onlyHash: true })) {
    lastCid = cid
  }
  
  return lastCid
}

export async function getData (client: IPFSHTTPClient, cid: string | CID) {
  const uintarr = await all(client.cat(cid))
  return str(cnc(uintarr))
}