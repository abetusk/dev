Inner Light Driver
===

The `Inner Light` jacket's LED strips are driven by a raspberry pi zero that
monitors two encoders, a microphone and drives the ws281x LED strips.

To try and separate concerns as much as possible the different components have been
split up into separate programs.

```

  |mic-beat-detector|   |encoder-monitor|
          \                     |
          (fd)                 (fd)
             \                  |
              \                 |
               \-----------|mode-manager|
                                |
                              (mmap)
                                |
                           <innerlight.led>
                                |
                              (mmap)
                                |
                            |led-driver|
```

Where `|.|` are programs, `(.)` are communication methods (`fd` for stdin/stdout, `mmap` for a memory mapped file) and `<.>` are files.

