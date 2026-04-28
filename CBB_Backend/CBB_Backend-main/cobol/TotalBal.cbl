       IDENTIFICATION DIVISION.
       PROGRAM-ID. TOTALBAL.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-CMDLINE  PIC X(500).
       01 WS-ARG      PIC X(30).
       01 WS-PTR      PIC 9(4) VALUE 1.
       01 WS-LEN      PIC 9(4).
       01 WS-TOTAL    PIC S9(18) VALUE 0.
       01 WS-VALUE    PIC S9(18).

       PROCEDURE DIVISION.

           ACCEPT WS-CMDLINE FROM COMMAND-LINE

           INSPECT WS-CMDLINE
               TALLYING WS-LEN FOR CHARACTERS BEFORE INITIAL SPACE

           PERFORM UNTIL WS-PTR > LENGTH OF WS-CMDLINE
               UNSTRING WS-CMDLINE
                   DELIMITED BY SPACE
                   INTO WS-ARG
                   WITH POINTER WS-PTR
               END-UNSTRING

               IF WS-ARG = SPACES
                   EXIT PERFORM
               END-IF

               MOVE FUNCTION NUMVAL(WS-ARG) TO WS-VALUE
               ADD WS-VALUE TO WS-TOTAL
           END-PERFORM

           DISPLAY WS-TOTAL
           STOP RUN.

