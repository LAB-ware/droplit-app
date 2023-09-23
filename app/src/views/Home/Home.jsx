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

import './Home.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOktaAuth } from '@okta/okta-react';
import OpenAI from 'openai';
import ImageModal from '../../components/Modal';

const accountNFT = [
  {
    image:
      'https://www.kicksonfire.com/wp-content/uploads/2021/01/Air-Jordan-1-KO-Chicago-2021.jpg',
    title: 'Original Jordan 1',
    worth: '6.339 ETH',
    created: '23 Sept, 2023',
    owner: 'Nike',
    description:
      "This image shows of a pair of Nike jordans. blue and white shoes. The shoes are made from a combination of materials, including leather, fabric, and rubber. They have an upper part that is mostly white with some blue accents on the sides and back. The laces are also white with blue stripes running through them. On the toe area there is a small logo in black which adds to the overall design of the shoe. The sole has several grooves for better grip when walking or running outdoors as well as providing cushioning for comfort while wearing them. These shoes look like they would be perfect for outdoor activities such as hiking or jogging due to their lightweight construction and breathable material which will keep your feet cool even during strenuous activity. Additionally, these shoes feature extra padding around the ankle area to provide additional support while you're out exploring nature or just taking a leisurely stroll around town!",
  },
];

const childrenNFT = [
  {
    image:
      'https://2app.kicksonfire.com/kofapp/upload/events_master_images/ipad_air-jordan-1-mid-se-gs-volt-vivid-orange.jpeg',
    title: 'Custom Jordan 1',
  },
  {
    image:
      'https://2app.kicksonfire.com/kofapp/upload/events_master_images/ipad_air-jordan-1-ko-true-blue-topaz-gold.jpg',
    title: 'Custom Jordan 2',
  },
  {
    image:
      'https://2app.kicksonfire.com/kofapp/upload/events_master_images/ipad_air-jordan-1-ko-field-purple.jpeg',
    title: 'Custom Jordan 3',
  },
  {
    image:
      'https://2app.kicksonfire.com/kofapp/upload/events_master_images/ipad_air-jordan-1-mid-gs-unc-to-chicago.jpeg',
    title: 'Custom Jordan 4',
  },
  {
    image:
      'https://2app.kicksonfire.com/kofapp/upload/events_master_images/ipad_air-jordan-1-mid-gs-game-winner.jpeg',
    title: 'Custom Jordan 5',
  },
];

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [minting, setMinting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nfts, setNfts] = useState(childrenNFT);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth.getUser().then((info) => setUserInfo(info));
    }
  }, [authState, oktaAuth]); // Update if authState changes

  if (!authState) {
    return <div>Loading...</div>;
  }

  const mint = async () => {
    setMinting(true);

    setTimeout(() => {
      setMinting(false);
    }, 3000);
  };

  const makeMyOwn = async (prompt) => {
    setLoading(true);
    const OPEN_AI_KEY = process.ENV.REACT_APP_OPEN_AI_KEY;
    const openai = new OpenAI({
      apiKey: OPEN_AI_KEY,
      dangerouslyAllowBrowser: true,
    });

    const res = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
    });

    setLoading(false);

    const update = [
      ...nfts,
      {
        image: res.data[0].url,
        title: 'Custom Jordan 5',
      },
    ];

    setNewImage(res.data[0].url);
    setModalIsOpen(true);
    setNfts(update);

    const pinUploadRes = await axios.post(
      `https://api.pinata.cloud/pinning/pinJSONToIPFS`,
      {
        pinataMetadata: {
          ownerName: userInfo?.name,
          email: userInfo?.email,
          name: 'image.jpg', // Name for the pinned file
        },
        pinataContent: {
          url: res.data[0].url, // URL of the image to pin
        },
      },
      {
        maxContentLength: 'Infinity',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: process.ENV.REACT_APP_PINATA_API,
          pinata_secret_api_key: process.ENV.REACT_APP_PINATA_SECRET,
        },
      }
    );

    console.log('Image upload successful', pinUploadRes.data);

    const mintRes = await axios.post(
      'http://localhost:5100/api/users/drop/mint',
      {
        walletAddress: '0x2D21887978c3e239E489fA0De5ef07B799c0aF7d',
        dropMetadataUrl:
          'azure-redundant-elephant-347.mypinata.cloud/ipfs/' +
          pinUploadRes.data.IpfsHash,
      }
    );

    console.log('Mint upload succesful', mintRes);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <ImageModal
        imageUrl={newImage}
        isOpen={modalIsOpen}
        onClose={closeModal}
      />
      <div>
        {authState.isAuthenticated && !userInfo && (
          <div>Loading user information...</div>
        )}

        {authState.isAuthenticated && userInfo && (
          <div>
            {accountNFT.map((item, index) => {
              return (
                <div key={index + 1} className='accountNFTContainer'>
                  <div className='image-container'>
                    <img
                      src={item.image}
                      alt={item.title}
                      className='accountNFTImage'
                    />
                  </div>
                  <div className='accountNFTDescription'>
                    <ul>
                      <li>Title: {item.title}</li>
                      <li>Owner: {item.owner}</li>
                      <li>Worth: {item.worth}</li>
                      <li>Created: {item.created}</li>
                    </ul>
                    <button class='ai-btn' onClick={mint} disabled={minting}>
                      {minting ? 'Minting...' : 'Get the Drop'}
                    </button>
                    <button
                      class='ai-btn'
                      disabled={loading}
                      onClick={() => makeMyOwn(item.description)}
                    >
                      {loading ? 'Loading....' : 'Limited Edition Drop'}
                    </button>
                    {loading && <p>Hang tight, this might take awhile</p>}
                  </div>
                </div>
              );
            })}
            <div className='grid'>
              {nfts.map((item, index) => {
                return (
                  <div key={index + 1} className='childrenNFT'>
                    <img
                      src={item.image}
                      alt={item.title}
                      className='childrenNFTImage'
                    />
                    <h3>{item.title}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!authState.isAuthenticated && <div>Please log in first!</div>}
      </div>
    </div>
  );
};

export default Home;
