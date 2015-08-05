# ngVisualizeAudio
ngVisualizeAudio.jS
Copyright (c) 2015 Gaurav Behere
Licensed as MIT 
-------------------------------

Angular directive to play and visualize audio

Based on HTML5's Audio APIs and angular's data binding.

How it works:

Just add "visualizeaudio" as attribute or add it as a tag, provide a audio source file.

**<div visualizeAudio src="data/Jonsong.mp3"></div>**



1. Inject "ng-visualizeAudio" as dependency in your module :
   angular.module("ngVisualizeAudioDemo", ['ng-visualizeAudio'])

2. Create a method in your controller, which makes the CSS properties ready for the data bound animation using your template:
   $scope.animationFunction = function(){
   
   //edit your modal here for which CSS properties are going to change
   
   }
   
   Check out example in the demo.
   
3. Create a custom template which uses the modal values bound to its CSS properties.
   eg: Check sample template here : 
   PS: Player controls - seek, progress, and play/pause buttons are added in the same template, which can be put into a different template.


4. Enjoy !


Demo: http://gauravbehere.in/ngVisualizeAudio/



