/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import NodePersist from "node-persist";
import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  minTime: 1,
  maxConcurrent: 1,
});

export async function createCache() {
  await NodePersist.init({
    ttl: 1000 * 60 * 60 * 24, // 24hrs
  });
}

export const putData = limiter.wrap(
  async (key: string, value: any, opts: NodePersist.DatumOptions = {}) => {
    return await NodePersist.setItem(key, value, opts as any);
  }
);

export const getData = limiter.wrap(async (key: string) => {
  const value = await NodePersist.getItem(key);
  return value;
});

export const clear = limiter.wrap(async () => {
  await NodePersist.clear();
});
