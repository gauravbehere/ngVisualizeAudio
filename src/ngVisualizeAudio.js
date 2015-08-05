/**
 * ngVisualizeAudio.jS
 * Copyright (c) 2015 Gaurav Behere
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */




window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
angular.module('ng-visualizeAudio', [])
    .service('audioSpectrumService', function () {
        return {
            audio: null,
            context: context,
            spectrumArray: null,
            source: null,
            sourceNode: null,
            analyser: null
        };
    })
    .directive('visualizeaudio', [
        'audioSpectrumService',
        function (audioSpectrumService) {
            return{
                restrict: 'AE',
                scope: '=',
                templateUrl: "templates/bars.html",
                link: function ($scope, $element, $attrs) {
                    $scope.currentTime = {};
                    audioSpectrumService.audio = new Audio();
                    audioSpectrumService.audio.loop = "infinite";
                    audioSpectrumService.audio.src = $attrs.src;
                    $scope.audioDuration = audioSpectrumService.audio.duration;
                    $scope.isAudioPlaying = true;

                    /**
                     * @method: drawSpectrum
                     * @private
                     * Calls the animation callback method of parent scope
                     */
                    var drawSpectrum = function () {
                        $scope.animationFunction(audioSpectrumService.spectrumArray);
                    };


                    /**
                     * @method: fillSpectrumArray
                     * @private
                     * Gets the current FFT snapshot from the analyser
                     */
                    var fillSpectrumArray = function () {
                        var array = new Uint8Array(audioSpectrumService.analyser.frequencyBinCount);
                        audioSpectrumService.analyser.getByteFrequencyData(array);
                        audioSpectrumService.spectrumArray = array;
                        drawSpectrum();
                        $scope.currentTime.seek = audioSpectrumService.audio.currentTime;
                        if ($scope.currentTime.seek < $scope.audioDuration)
                            window.requestAnimationFrame(fillSpectrumArray);
                    };

                    /**
                     * Handle to seek
                     */
                    $scope.progressChange = function () {
                        audioSpectrumService.audio.currentTime = this.currentTime.seek;
                    };

                    /**
                     * Handle to play/pause button
                     */
                    $scope.playPauseToggle = function () {
                        if ($scope.isAudioPlaying == true) {
                            $scope.isAudioPlaying = false;
                            audioSpectrumService.audio.pause();
                        }
                        else {
                            $scope.isAudioPlaying = true;
                            audioSpectrumService.audio.play();
                        }
                    };

                    /**
                     * Initial setup for factory data
                     */
                    audioSpectrumService.audio.addEventListener('canplay', function (e) {
                        console.log('can play track');
                        $scope.audioDuration = audioSpectrumService.audio.duration;
                        audioSpectrumService.analyser = (audioSpectrumService.analyser || audioSpectrumService.context.createAnalyser());
                        audioSpectrumService.source = audioSpectrumService.context.createBufferSource();
                        audioSpectrumService.analyser.fftSize = 1024;
                        try {
                            audioSpectrumService.sourceNode = audioSpectrumService.context.createMediaElementSource(audioSpectrumService.audio);
                        }
                        catch (e) {
                            return;
                        }
                        audioSpectrumService.sourceNode.connect(audioSpectrumService.analyser);
                        audioSpectrumService.sourceNode.connect(audioSpectrumService.context.destination);
                        audioSpectrumService.audio.play();
                        fillSpectrumArray();
                    });
                }
            };
        }
    ]);

