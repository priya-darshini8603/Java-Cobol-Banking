       IDENTIFICATION DIVISION.
       PROGRAM-ID. EMI-CALC.

       DATA DIVISION.
       WORKING-STORAGE SECTION.

       01 WS-CMD              PIC X(100).
       01 WS-P-TXT            PIC X(15).
       01 WS-R-TXT            PIC X(10).
       01 WS-N-TXT            PIC X(10).

       01 WS-P-D              COMP-2.
       01 WS-RATE-D           COMP-2.
       01 WS-N-D              COMP-2.

       01 WS-R                COMP-2.
       01 WS-ONEPLUS          COMP-2.
       01 WS-POWER            COMP-2.
       01 WS-EMI              COMP-2.

       01 WS-TOTAL-PAYMENT    COMP-2.
       01 WS-TOTAL-INTEREST   COMP-2.

       01 WS-INVALID          PIC X VALUE 'N'.

       PROCEDURE DIVISION.

           ACCEPT WS-CMD FROM COMMAND-LINE

           UNSTRING WS-CMD DELIMITED BY ALL SPACES
               INTO WS-P-TXT WS-R-TXT WS-N-TXT
           END-UNSTRING

           MOVE FUNCTION NUMVAL(WS-P-TXT) TO WS-P-D
           MOVE FUNCTION NUMVAL(WS-R-TXT) TO WS-RATE-D
           MOVE FUNCTION NUMVAL(WS-N-TXT) TO WS-N-D

           IF WS-P-D <= 0 OR WS-N-D <= 0
               MOVE 'Y' TO WS-INVALID
           END-IF

           COMPUTE WS-R = WS-RATE-D / 12 / 100

           IF WS-INVALID = 'N'
               IF WS-R = 0
                   COMPUTE WS-EMI = WS-P-D / WS-N-D
               ELSE
                   COMPUTE WS-ONEPLUS = 1 + WS-R
                   COMPUTE WS-POWER = WS-ONEPLUS ** WS-N-D

                   IF WS-POWER = 1
                       MOVE 'Y' TO WS-INVALID
                   ELSE
                       COMPUTE WS-EMI =
                           (WS-P-D * WS-R * WS-POWER) /
                           (WS-POWER - 1)
                   END-IF
               END-IF
           END-IF

           IF WS-INVALID = 'Y'
               DISPLAY "INVALID"
           ELSE
               COMPUTE WS-TOTAL-PAYMENT = WS-EMI * WS-N-D
               COMPUTE WS-TOTAL-INTEREST = WS-TOTAL-PAYMENT - WS-P-D

               DISPLAY
                   FUNCTION INTEGER(WS-EMI + 0.5) SPACE
                   FUNCTION INTEGER(WS-TOTAL-PAYMENT + 0.5) SPACE
                   FUNCTION INTEGER(WS-TOTAL-INTEREST + 0.5)
           END-IF

           STOP RUN.


