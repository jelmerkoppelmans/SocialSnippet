var spawn = require('child_process').spawn;

function getVideoURL (PRID, cb) {
	const resolveURL = spawn('curl', ['-Ls', '-o', '/dev/null', '-w', '%{url_effective}', 'http://www.npo.nl/'+PRID])
	resolveURL.stdout.on('data', function(data) {
		const youtubeDl = spawn('youtube-dl', 
		['-g', '--skip-download', 
		data.toString()
		]);

		youtubeDl.stdout.on('data', function(data) {
			cb({ prid: PRID, url: data.toString() });
		});

		youtubeDl.stderr.on('data', function (data) {
		  console.log('stderr: ' + data);
		});
	});

	resolveURL.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});
}

module.exports = {
  getVideoURL
};