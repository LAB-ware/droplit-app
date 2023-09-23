/*
 * Copyright (c) 2021-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import OpenAI from 'openai';
import './GenAI.scss';
// import fs from 'fs';
import jordans from './blue-jordans.png'

// var fs = require('fs');

const GenAI = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [prompt, setPrompt] = useState("");
  const OPEN_AI_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  const [result, setResult] = useState("");
  const [variant, setVariant] = useState("");
  
  const generateImage = async () => {
      const openai = new OpenAI({
        apiKey: OPEN_AI_KEY,
        dangerouslyAllowBrowser: true });
    const res = await openai.images.generate({
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });
      console.log(res.data[0].url)
    setResult(res.data[0].url);
  };

  const generateVariant = async () => {
    const openai = new OpenAI({
      apiKey: OPEN_AI_KEY,
      dangerouslyAllowBrowser: true });
  const res = await openai.images.createVariation({
      image: jordans,
      n: 1,
      size: "1024x1024",
    });
    console.log(res.data[0].url)
  setVariant(res.data[0].url);
};

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      setUserInfo(null);
    } else {
      setUserInfo(authState.idToken.claims);
        oktaAuth.getUser().then((info) => {
            setUserInfo(info);
        });
    }
  }, [authState, oktaAuth]); // Update if authState changes

  if (!userInfo) {
    return (
      <div>
        <p>Fetching user profile...</p>
      </div>
    );
  }

  return (
    <div className="main-container">
        <div className="generation-container">
            <>
                <h2>Generate your custom NFT with OpenAI's DALL-E</h2>

                <textarea
                    className="app-input"
                    placeholder="If you can Imagine it, we can create it :)"
                    onChange={(e) => setPrompt(e.target.value)}
                    rows="10"
                    cols="40"
                />
                
                <br></br>

                <button onClick={generateImage}>Generate an Image</button>

                <br></br>

                {result.length > 0 ? (
                    <img className="result-image" src={result} alt="result" />
                    ) : (
                    <></>
                )}
            </>
        </div>

        <div className="variation-container">
            <>
                <h2>...or generate something limited edition</h2>
                
                <br></br>

                <button onClick={generateVariant}>Generate a Variant</button>

                <br></br>

                {result.length > 0 ? (
                    <img className="variant-image" src={variant} alt="variant" />
                    ) : (
                    <></>
                )}
            </>
        </div>
   
    </div>
  );
};

export default GenAI;
