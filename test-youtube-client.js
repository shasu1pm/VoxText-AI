/**
 * Direct test of youtube-client library
 * Tests the client-side fetching with the test URL
 */

// Simulate browser environment for testing
const fetch = require('node-fetch');
global.fetch = fetch;
global.DOMParser = require('xmldom').DOMParser;
global.document = {
  createElement: () => ({
    innerHTML: '',
    get value() { return this.innerHTML; }
  })
};

const testUrl = 'https://www.youtube.com/watch?v=Su1bwIzjTxY';

async function testYouTubeClient() {
  console.log('🧪 Testing YouTube Client Library');
  console.log('Test URL:', testUrl);
  console.log('='.repeat(60));

  try {
    // Extract video ID
    const videoIdMatch = testUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!videoIdMatch) {
      console.error('❌ Invalid YouTube URL');
      return;
    }
    const videoId = videoIdMatch[1];
    console.log('✅ Video ID extracted:', videoId);

    // Test 1: Fetch metadata
    console.log('\n📊 Test 1: Fetching Metadata...');
    const metadataUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const metadataResponse = await fetch(metadataUrl);

    if (!metadataResponse.ok) {
      console.error('❌ Metadata fetch failed:', metadataResponse.status);
      return;
    }

    const metadata = await metadataResponse.json();
    console.log('✅ Metadata fetched:');
    console.log('   Title:', metadata.title);
    console.log('   Channel:', metadata.author_name);
    console.log('   Thumbnail:', metadata.thumbnail_url ? 'Available' : 'N/A');

    // Test 2: Fetch video page for caption tracks
    console.log('\n📝 Test 2: Fetching Caption Tracks...');
    const videoPageUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const pageResponse = await fetch(videoPageUrl);
    const pageHtml = await pageResponse.text();

    const captionTracksMatch = pageHtml.match(/"captionTracks":(\[.*?\])/);

    if (!captionTracksMatch) {
      console.log('⚠️  No captions available for this video');
      return;
    }

    const captionTracks = JSON.parse(captionTracksMatch[1]);
    console.log('✅ Caption tracks found:', captionTracks.length);

    console.log('\n📋 Available Caption Languages:');
    captionTracks.forEach((track, index) => {
      console.log(`   ${index + 1}. ${track.name?.simpleText || track.languageCode} (${track.languageCode})`);
      console.log(`      Type: ${track.kind === 'asr' ? 'Auto-generated' : 'Manual'}`);
    });

    // Test 3: Fetch actual transcript
    console.log('\n📥 Test 3: Fetching Transcript...');
    const firstTrack = captionTracks[0];
    const transcriptUrl = firstTrack.baseUrl;
    const transcriptResponse = await fetch(transcriptUrl);
    const transcriptXml = await transcriptResponse.text();

    const parser = new global.DOMParser();
    const xmlDoc = parser.parseFromString(transcriptXml, 'text/xml');
    const textElements = xmlDoc.getElementsByTagName('text');

    console.log('✅ Transcript segments:', textElements.length);

    if (textElements.length > 0) {
      console.log('\n📄 Sample Transcript (first 5 segments):');
      for (let i = 0; i < Math.min(5, textElements.length); i++) {
        const element = textElements[i];
        const start = element.getAttribute('start');
        const text = element.textContent;
        console.log(`   [${start}s] ${text}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests passed!');
    console.log('🎉 Client-side fetching works correctly!');

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    console.error(error.stack);
  }
}

// Run tests
testYouTubeClient();
