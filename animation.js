class Animation {
    
    constructor(frames, numberOfSequencesPerSec) {
        this.time = 0;
        this.count = 0;
        this.frames = frames;
        this.stopped = false;
        this.numberOfSequencesPerSec = numberOfSequencesPerSec;
        this.sequences = 0;
        this.stopAtSequence = -1;
        this.stopAtSequenceCallback = null;
    }
    
    update(deltatime) {
        if (!this.stopped) {
            var fps = 1 / deltatime;
            var ratio = fps / this.numberOfSequencesPerSec;
            this.time += deltatime;
            if (this.time >= (ratio / this.frames) / fps) {
                this.count++;
                this.count %= this.frames;
                if (this.count === 0) {
                    this.sequences++;
                }
                this.time = 0;
            }
        }
        if (this.sequences === this.stopAtSequence) {
            this.stopped = true;
            this.sequences = 0;
            this.count = this.frames - 1;
            if (this.stopAtSequenceCallback !== null) {
                this.stopAtSequenceCallback();
            }
        }
    }

    stopAtSequenceNumber(n, callback) {
        this.stopAtSequence = n; 
        this.stopAtSequenceCallback = callback;
    }

    getFrame() {
        return this.count;
    }

    stop() {
        this.stopped = true;
    }

    isStopped() {
        return this.stopped;
    }

    lastFrame() {
        return this.frames - 1;
    }

    getNumberOfSequences() {
        return this.sequences;
    }

    reset() {
        this.count = 0;
        this.stopped = false;
        this.sequences = 0;
        this.time = 0;
    }
};